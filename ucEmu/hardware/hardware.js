/*
TODO list:
    + [0.50h] move output computing to handlers (default value at abstract)
    + [0.25h] remember to update output when cpu boots because we dont have faling edge at thus point
    + [1.00h] remove dumpHex and use hex
    + [0.50h] new services for object creation (remove all 'new' aross code), AluProvider.create(cpu) / AluCreator.create(cpu) / AluBuilder.create()
    + [0.75h] service for logging with verbose levels
    + [0.50h] add aliases for cpu internals at abstract-sequencer-handler, CHECK PERFORMANCE -> no change :/
    + [0.50h] rename sequencer handler to some microCode blabla?
                + sequencer -> ControlUnit
                + serquencer-handler -> microcode
                + handler@sequencer -> controlStore
                + STATE@seqauencer -> MICROCODE
                + STATE@sequencerBuilder -> moved to ControlUnit
                + state param @sequencerBuilder.build() -> microcode
    + [1.00h] change structure of dumping cpu state
                + create dumpState method that returns array with name, value, and bitSize - all divided into sections register, input, output, extra
                + ability to pass previous dumpState to mark changes values - changed = true/false/null
                + move Instruction State and Microcode State to separate file (also method for fetching key by value)
                + return instr/microcode state at extra field in cpu dump
    + [1.50h] create new MemoryController and move all code related to col/row/shift/mask manipulation
    + [0.25h] rename registerSet to registerFile
    + [0.25h] introduce registers for memoryWrite and memoryRowAddress
    + [0.50h] refactor all output computing, they should use newly created registers
    + [0.25h] rename regTimer to regClockTick
    + [0.50h] restructure microcode (rename microcode-execute-* to microcode-handler-*, two directories 'microcode' and 'microcode-handler')
    + [0.50h] move all combinational logic into services without access to CPU, remove CpuAware class
    + [?.??h] move instruction set creation to control unit
    + [?.??h] split instructions into separate classes like opcode handlers
    + [?.??h] change 'instruction decoder' service name to some 'instruction register spliter'
    + [?.??h] move output update to cpu
    + [?.??h] new parameter or microcode handlers (instruction), fix undefined methods errors
    + [?.??h] add WE clock flags to the microcodeHandlers
    + [?.??h] create RegisterBag class
    + [?.??h] move common bit sizes to dedicated service
    + [?.??h] move register reset to microcode handlers
    + [?.??h] create virtual NotYetDecoded instruction for fetch-first microcode phase
    + [?.??h] microcode handlers should use internalResultBag
    + [?.??h] split data propagation and data storing at microcode handlers

    - [?.??h] split data propagation and data storing at CPU
    - [?.??h] add microcode jump to microcode handler itself (we have also extra Microcode.??)
    - [?.??h] registerFile instead of single read should have channels like: out0, out1, outAddress
    - [?.??h] remove MemoryAccess register approach
    - [?.??h] change jnz to jz
    - [0.50h] figure out how to load regClockTick (check row address 0xFFF at memory controller?)
    - [1.00h] implement store instruction
    - [?.??h] any register support at ld/st
    
        :: fun starts here ::
    - [1.5h] add DI and clean up
    - [?.?h] test performance with dedicated Register and Signal classes (masking by bitSize and toString would be inside)
    - [1.0h] move project to separate GitHub repo ('SimpleCPU')

CPU inputs:
    - [1 bit] clock
    - [1 bit] reset
    - [32 bit] memoryRead

CPU outputs:
    - [14 bit] memoryRowAddress
    - [32 bit] memoryWrite
    - [1 bit] memoryWE

 */

/*
 ? cycles   | 0x0R 0xRR            | 00 | add     regOut, regIn0, regIn1        | regOut = regIn0 + regIn1
 ? cycles   | 0x1R 0xRR            | 01 | nand    regOut, regIn0, regIn1        | regOut = regIn0 nand regIn1
 ? cycles   | 0x2R 0xRR            | 02 | sh      regOut, regIn0, regIn1        | regOut = (regIn1>=0) ? (regIn0 << regIn1) : (regIn0 >>> abs(regIn1))
 ? cycles   | 0x3_ 0xRR            | 03 | jnz     regIn0, regIn1                | if (regIn1!=0) jump to address from regIn0
 ? cycles   | 0x4R 0xR_            | 04 | copy    regOut, regIn0                | regOut = regIn0
 ? cycles   | 0x5R 0x__ 0xCC 0xCC  | 05 | imm     regOut, _constant16bit_       | regOut = _constant16bit_
 ? cycles   | 0x6_ 0xR_            | 06 | ld      regIn0                        | regMem = MemoryAt[regIn0]
 ? cycles   | 0x7_ 0xR_            | 07 | st      regIn0                        | MemoryAt[regIn0] = regMem
 */

// 3.95 emulated MHz / second @ 3.6 GHz real cpu      # old score
// 2.35 emulated MHz / second @ 3.6 GHz real cpu      # current score 2016-09-21
// 4.50 emulated MHz / second @ 3.6 GHz real cpu      # current score 2016-09-22
// 3.90 emulated MHz / second @ 3.6 GHz real cpu      # current score 2016-09-30
var benchmarkMode = null;//3.9;

var memoryState = [
    { row: 0x0000, data: [0x00, 0x00, 0x10, 0x00] },
    { row: 0x0001, data: [0x20, 0x00, 0x30, 0x07] },
    { row: 0x0002, data: [0x45, 0x00, 0x50, 0x00] },
    { row: 0x0003, data: [0xff, 0xff, 0x60, 0x10] },
    { row: 0x0004, data: [0x70, 0x10, 0x00, 0x00] }
];
Logger.setVerbose(benchmarkMode ? -1 : 4);
var cpu = new Cpu();
var staticRam = new StaticRam(
    cpu.outputBag.memoryRowAddress,
    cpu.outputBag.memoryWE,
    cpu.outputBag.memoryWrite
);
syncCpuWithStaticRam();
cpu.setClock(false);
staticRam.log(0, 4);
cpuLog(true);
Logger.log(0, "\n");

triggerCpuResetAndProgramStaticRam();

var secondsStart = new Date().getTime();
document.write('START<br/>');

runCpu();

var secondsEnd = new Date().getTime();
document.write('STOP<br/> ' + (secondsEnd - secondsStart) + ' ms' + '<br/>');

function triggerCpuResetAndProgramStaticRam() {
    var i;

    Logger.log(1, '------------------------------------------------------------------------------------------------------------');
    Logger.log(1, '                                                                                       reset & program BEGIN');    
    Logger.log(1, '\n');

    for (i = 0; i < 2; i++) {
        Logger.log(1, '[ACTION] reset enable #' + i);
        cpu.inputBag.reset = true;
        clockHigh();
        clockLow();
        Logger.log(1, "\n");        
    }

    Logger.log(1, '[ACTION] program loop');
    programStaticRamAndSync(memoryState);
    staticRam.log(0, 4);
    cpuLog(true);
    Logger.log(1, "\n");

    Logger.log(1, '[ACTION] reset disable');
    cpu.inputBag.reset = false;
    clockHigh();
    clockLow();
    Logger.log(1, "\n");

    Logger.log(0, '                                                                                         reset & program END');
    Logger.log(0, '------------------------------------------------------------------------------------------------------------');
    Logger.log(0, "\n");
}

function runCpu() {
    var
        clockTicks = 0,
        clockTicksToDo;

    clockTicksToDo = benchmarkMode ? Math.round(benchmarkMode * 1000 * 1000) : 30;

    while (clockTicks < clockTicksToDo) {
        clockTicks++;
        clockHigh();
        clockLow();

        if (!Logger.isEnabled()) {
            continue;
        }

        Logger.log(1, '----> clockTicks ' + clockTicks);
        Logger.log(1, "\n");
        
        if (cpu.registerBag.regSequencer == Microcode.FETCH_FIRST) {
            Logger.log(
                0, 
                '                                                      ' +
                '                               clockTicks: ' + BitUtil.hex(clockTicks, BitSize.MEMORY_WIDTH)
            );

            Logger.log(
                0,
                "------------------------------------------------------" +
                "------------------------------------------------------" +
                "\n\n"
            );
        }
    }
}

function programStaticRamAndSync(memoryState) {
    for (var i = 0; i < memoryState.length; i++) {
        var ms = memoryState[i];

        staticRam.setMemoryWE(false);

        staticRam.setRow(ms.row);
        staticRam.setDataIn(BitUtil.byteRowTo32bit(ms.data));

        staticRam.setMemoryWE(true);
        staticRam.setMemoryWE(false);
    }
    syncCpuWithStaticRam();
}

function syncCpuWithStaticRam() {
    staticRam.setRow(cpu.outputBag.memoryRowAddress);
    staticRam.setDataIn(cpu.outputBag.memoryWrite);
    staticRam.setMemoryWE(cpu.outputBag.memoryWE);

    cpu.inputBag.memoryRead = staticRam.getDataOut();
}

function clockHigh() {
    cpu.setClock(true);
    syncCpuWithStaticRam();

    if (Logger.isEnabled()) {
        cpuLog();  // not needed that much - we can comment it
    }

}

function clockLow() {
    cpu.setClock(false);
    syncCpuWithStaticRam();

    if (Logger.isEnabled()) {
        cpuLog();
    }
}

var dumpPrevious;

function cpuLog(hideCpuClockInfo) {
    var rf = cpu.registerBag.registerFile,
        c = cpu.registerBag;

    if (!hideCpuClockInfo) {
        if (cpu.inputBag.clock) {
            Logger.log(1, '----> CPU state after rising edge of the clock (signals are still propagating thought the CPU)');
        } else {
            Logger.log(1, '----> CPU state after faling edge of the clock (results/inputs latched in flipflops)');
        }
    }
    
    Logger.log(
        1,
        'in.clock: ' + cpu.inputBag.clock + ' | ' +
        'in.memoryRead = ' + BitUtil.hex(cpu.inputBag.memoryRead, BitSize.MEMORY_WIDTH) + ' | ' +
        'in.reset = ' + BitUtil.hex(cpu.inputBag.reset, BitSize.SINGLE_BIT) + '      ' +
        'out.memoryRowAddress = ' + BitUtil.hex(cpu.outputBag.memoryRowAddress, BitSize.ADDRESS_ROW) + ' | ' +
        'out.memoryWrite = ' + BitUtil.hex(cpu.outputBag.memoryWrite, BitSize.MEMORY_WIDTH) + ' | ' +
        'out.memoryWE = ' + BitUtil.hex(cpu.outputBag.memoryWE, BitSize.SINGLE_BIT)
    );

    Logger.log(
        1,
        'regReset = ' + BitUtil.hex(c.regReset, BitSize.SINGLE_BIT) + ' | ' +
        'regSequencer = ' + BitUtil.hex(c.regSequencer, BitSize.SEQUENCER) + ' | ' +
        'regInstruction = ' + BitUtil.hex(c.regInstruction, BitSize.MEMORY_WIDTH) + ' | ' +
        'regClockTick = ' + BitUtil.hex(c.regClockTick, BitSize.MEMORY_WIDTH)
    );
    Logger.log(
        1,
        'regMemoryBuffer = ' + BitUtil.hex(c.regMemoryBuffer, BitSize.MEMORY_WIDTH) + ' | ' +
        'regMemoryRowAddress = ' + BitUtil.hex(c.regMemoryRowAddress, BitSize.ADDRESS_ROW) + ' | ' +
        'regMemoryWrite = ' + BitUtil.hex(c.regMemoryWrite, BitSize.MEMORY_WIDTH)
    );
    Logger.log(
        1,
        'reg00 = ' + BitUtil.hex(rf.read(0), BitSize.REGISTER) + ' | ' +
        'reg01 = ' + BitUtil.hex(rf.read(1), BitSize.REGISTER) + ' | ' +
        'reg02 = ' + BitUtil.hex(rf.read(2), BitSize.REGISTER) + ' | ' +
        'reg03 = ' + BitUtil.hex(rf.read(3), BitSize.REGISTER) + ' | ' +
        'reg04 = ' + BitUtil.hex(rf.read(4), BitSize.REGISTER) + ' | ' +
        'reg05 = ' + BitUtil.hex(rf.read(5), BitSize.REGISTER) + ' | ' +
        'reg06 = ' + BitUtil.hex(rf.read(6), BitSize.REGISTER) + ' | ' +
        'reg07 = ' + BitUtil.hex(rf.read(7), BitSize.REGISTER)
    );
    Logger.log(
        1,
        'reg08 = ' + BitUtil.hex(rf.read(8), BitSize.REGISTER) + ' | ' +
        'reg09 = ' + BitUtil.hex(rf.read(9), BitSize.REGISTER) + ' | ' +
        'reg10 = ' + BitUtil.hex(rf.read(10), BitSize.REGISTER) + ' | ' +
        'reg11 = ' + BitUtil.hex(rf.read(11), BitSize.REGISTER) + ' | ' +
        'reg12 = ' + BitUtil.hex(rf.read(12), BitSize.REGISTER) + ' | ' +
        'reg13 = ' + BitUtil.hex(rf.read(13), BitSize.REGISTER) + ' | ' +
        'reg14 = ' + BitUtil.hex(rf.read(14), BitSize.REGISTER) + ' | ' +
        'regPC = ' + BitUtil.hex(rf.read(RegisterFile.PROGRAM_COUNTER), BitSize.REGISTER)
    );

    if (!benchmarkMode) {
        var dump;

        dump = cpu.dumpState(dumpPrevious);
        // console.log(dump);
        dumpPrevious = dump;
    }
}

staticRam.log(0, 4);
staticRam.log(0x100, 0x102);


/*
    inputs + registers
    instruction + opcode
    outputs
    [clock HIGH] :: sync with ram ::
    inputs
    outputs
    [clock LOW] :: sync with ram ::

 */














































