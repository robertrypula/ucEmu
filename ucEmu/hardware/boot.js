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

    - [1.00h] implement store instruction
    - [0.50h] move all combinational logic into services without access to CPU, remove CpuAware class
    - [0.50h] figure out how to load regClockTick (check row address 0xFFF at memory controller?)

        :: fun starts here ::
    - [1.5h] add DI and clean up
    - [1.0h] move project to separate GitHub repo ('SimpleCPU')
    - [2.0h] integrate CPU (without static memory) class with Module/Signal class from other repo

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
var benchmarkMode = null;//4.5;

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
    cpu.output.memoryRowAddress,
    cpu.output.memoryWE,
    cpu.output.memoryWrite
);
syncCpuWithStaticRam();
cpu.setClock(false);
staticRam.log(0, 4);
cpuLog(true);
Logger.log(0, "\n");

triggerCpuResetAndProgramStaticRam();

// TODO does those lines are really needed?
/*
cpu.setClock(false);
syncCpuWithStaticRam();
cpu.setClock(false);
syncCpuWithStaticRam();
*/

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
        cpu.input.reset = true;
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
    cpu.input.reset = false;
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
        
        if (cpu.core.regSequencer == Microcode.MICROCODE.FETCH_FIRST) {
            Logger.log(
                0, 
                '                                                      ' +
                '                               clockTicks: ' + BitUtil.hex(clockTicks, BitUtil.BYTE_4)
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

        staticRam.setWriteEnable(false);

        staticRam.setRow(ms.row);
        staticRam.setDataIn(BitUtil.byteRowTo32bit(ms.data));

        staticRam.setWriteEnable(true);
        staticRam.setWriteEnable(false);
    }
    syncCpuWithStaticRam();
}

function syncCpuWithStaticRam() {
    staticRam.setRow(cpu.output.memoryRowAddress);
    staticRam.setDataIn(cpu.output.memoryWrite);
    staticRam.setWriteEnable(cpu.output.memoryWE);

    cpu.input.memoryRead = staticRam.getDataOut();
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
    var rf = cpu.core.registerFile,
        c = cpu.core;

    if (!hideCpuClockInfo) {
        if (cpu.input.clock) {
            Logger.log(1, '----> CPU state after rising edge of the clock (signals are still propagating thought the CPU)');
        } else {
            Logger.log(1, '----> CPU state after faling edge of the clock (results/inputs latched in flipflops)');
        }
    }
    
    Logger.log(
        1,
        'in.clock: ' + cpu.input.clock + ' | ' +
        'in.memoryRead = ' + BitUtil.hex(cpu.input.memoryRead, BitUtil.BYTE_4) + ' | ' +
        'in.reset = ' + BitUtil.hex(cpu.input.reset, BitUtil.BIT_1) + '      ' +
        'out.memoryRowAddress = ' + BitUtil.hex(cpu.output.memoryRowAddress, BitUtil.BYTE_2 - BitUtil.BIT_2) + ' | ' +
        'out.memoryWrite = ' + BitUtil.hex(cpu.output.memoryWrite, BitUtil.BYTE_4) + ' | ' +
        'out.memoryWE = ' + BitUtil.hex(cpu.output.memoryWE, BitUtil.BIT_1)
    );

    Logger.log(
        1,
        'regReset = ' + BitUtil.hex(c.regReset, BitUtil.BIT_1) + ' | ' +
        'regSequencer = ' + BitUtil.hex(c.regSequencer, BitUtil.BYTE_HALF) + ' | ' +
        'regInstruction = ' + BitUtil.hex(c.regInstruction, BitUtil.BYTE_4) + ' | ' +
        'regClockTick = ' + BitUtil.hex(c.regClockTick, BitUtil.BYTE_4)
    );
    Logger.log(
        1,
        'regMemoryBuffer = ' + BitUtil.hex(c.regMemoryBuffer, BitUtil.BYTE_4) + ' | ' +
        'regMemoryRowAddress = ' + BitUtil.hex(c.regMemoryRowAddress, BitUtil.BYTE_2 - BitUtil.BIT_2) + ' | ' +
        'regMemoryWrite = ' + BitUtil.hex(c.regMemoryWrite, BitUtil.BYTE_4)
    );
    Logger.log(
        1,
        'reg00 = ' + BitUtil.hex(rf.read(0), BitUtil.BYTE_2) + ' | ' +
        'reg01 = ' + BitUtil.hex(rf.read(1), BitUtil.BYTE_2) + ' | ' +
        'reg02 = ' + BitUtil.hex(rf.read(2), BitUtil.BYTE_2) + ' | ' +
        'reg03 = ' + BitUtil.hex(rf.read(3), BitUtil.BYTE_2) + ' | ' +
        'reg04 = ' + BitUtil.hex(rf.read(4), BitUtil.BYTE_2) + ' | ' +
        'reg05 = ' + BitUtil.hex(rf.read(5), BitUtil.BYTE_2) + ' | ' +
        'reg06 = ' + BitUtil.hex(rf.read(6), BitUtil.BYTE_2) + ' | ' +
        'reg07 = ' + BitUtil.hex(rf.read(7), BitUtil.BYTE_2)
    );
    Logger.log(
        1,
        'reg08 = ' + BitUtil.hex(rf.read(8), BitUtil.BYTE_2) + ' | ' +
        'reg09 = ' + BitUtil.hex(rf.read(9), BitUtil.BYTE_2) + ' | ' +
        'reg10 = ' + BitUtil.hex(rf.read(10), BitUtil.BYTE_2) + ' | ' +
        'reg11 = ' + BitUtil.hex(rf.read(11), BitUtil.BYTE_2) + ' | ' +
        'reg12 = ' + BitUtil.hex(rf.read(12), BitUtil.BYTE_2) + ' | ' +
        'reg13 = ' + BitUtil.hex(rf.read(13), BitUtil.BYTE_2) + ' | ' +
        'regMA = ' + BitUtil.hex(rf.getMemoryAccess(), BitUtil.BYTE_2) + ' | ' +
        'regPC = ' + BitUtil.hex(rf.getProgramCounter(), BitUtil.BYTE_2)
    );

    if (!benchmarkMode) {
        var dump;

        dump = cpu.dumpState(dumpPrevious);
        console.log(dump);
        dumpPrevious = dump;
    }
}

staticRam.log(0, 4);
staticRam.log(0x100, 0x102);
