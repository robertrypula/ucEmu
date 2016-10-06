/*
TODO list:
    + [0.50h] move output computing to handlers (default value at abstract)
    + [0.25h] remember to update output when cpu boots because we dont have faling edge at thus point
    + [1.00h] remove cpuStateHex and use hex
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
    + [1.00h] change structure of cpuStateing cpu state
                + create cpuStateState method that returns array with name, value, and bitSize - all divided into sections register, input, output, extra
                + ability to pass previous cpuStateState to mark changes values - changed = true/false/null
                + move Instruction State and Microcode State to separate file (also method for fetching key by value)
                + return instr/microcode state at extra field in cpu cpuState
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
    + [?.??h] split data propagation and data storing at CPU

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
var
    benchmarkMode = null,//3.9,
    staticRamData = [
        { rowAddress: 0x0000, data: [0x00, 0x00, 0x10, 0x00] },
        { rowAddress: 0x0001, data: [0x20, 0x00, 0x30, 0x07] },
        { rowAddress: 0x0002, data: [0x45, 0x00, 0x50, 0x00] },
        { rowAddress: 0x0003, data: [0xff, 0xff, 0x60, 0x10] },
        { rowAddress: 0x0004, data: [0x70, 0x10, 0x00, 0x00] }
    ],
    cpu = new Cpu(),
    staticRam = new StaticRam(),
    secondsStart,
    secondsEnd,
    cpuState,
    cpuStatePrevious;

Logger.setVerbose(benchmarkMode ? -1 : 4);

function initialize() {
    var i;

    syncCpuWithStaticRam();
    for (i = 0; i < 2; i++) {
        cpu.setReset(true);
        makeOneClockCycle();
    }

    staticRam.log(0, 4);
    staticRamFillWithData(staticRamData);
    makeOneClockCycle();
    staticRam.log(0, 4);

    cpu.setReset(false);
    makeOneClockCycle();

    // -----

    secondsStart = new Date().getTime();
    Logger.log(0, '\n\n***************\n     START\n***************\n\n');
    runCpu();
    secondsEnd = new Date().getTime();
    Logger.log(0, '\n\n*************************\n     STOP ' + (secondsEnd - secondsStart) + ' ms\n*************************\n\n');
    if (benchmarkMode) {
        alert((secondsEnd - secondsStart) + ' ms');
    }
}

function runCpu() {
    var clockTicks, clockTicksToDo;

    clockTicks = 0;
    clockTicksToDo = benchmarkMode ? Math.round(benchmarkMode * 1000 * 1000) : 30;
    while (clockTicks < clockTicksToDo) {
        clockTicks++;
        makeOneClockCycle();
    }
}

function staticRamFillWithData(staticRamData) {
    var i, ms;

    for (i = 0; i < staticRamData.length; i++) {
        ms = staticRamData[i];

        staticRam.setMemoryWE(false);

        staticRam.setRowAddress(ms.rowAddress);
        staticRam.setDataIn(BitUtil.byteRowTo32bit(ms.data));

        staticRam.setMemoryWE(true);
        staticRam.setMemoryWE(false);
    }
}

function syncCpuWithStaticRam() {
    staticRam.setRowAddress(cpu.getMemoryRowAddress());
    staticRam.setDataIn(cpu.getMemoryWrite());
    staticRam.setMemoryWE(cpu.getMemoryWE());
    cpu.setMemoryRead(staticRam.getDataOut());
}

function makeOneClockCycle() {
    getCpuState();
    logSeparator();
    logCpuStateGroup('input');
    logCpuStateGroup('output');
    logCpuStateGroup('registerSpecialPurpose');
    logCpuStateGroup('registerGeneralPurpose');
    logCpuStateExtraGroup();

    cpu.setClock(true);
    syncCpuWithStaticRam();
    logClockInfo(true);

    getCpuState();
    logCpuStateGroup('input');
    logCpuStateGroup('output');

    cpu.setClock(false);
    syncCpuWithStaticRam();
    logClockInfo(false);
}

function getCpuState() {
    if (!benchmarkMode) {
        cpuState = cpu.getState(cpuStatePrevious);
        cpuStatePrevious = cpuState;
    }
}

function logCpuStateExtraGroup() {
    if (benchmarkMode) {
        return;
    }

    Logger.log(0, ':::: INSTRUCTION: ' + cpuState.extra.opcode.value + ', ' + cpuState.extra.instructionName.value);
    Logger.log(0, ':::: MICROCODE: ' + cpuState.extra.microcode.value + ', ' + cpuState.extra.microcodeName.value);
}

function logCpuStateGroup(groupName) {
    var group, key, entry, str;

    if (benchmarkMode) {
        return;
    }

    group = cpuState[groupName];
    str = '';
    for (key in group) {
        entry = group[key];
        switch (groupName) {
            case 'input':
                str += 'INPUT : ';
                break;
            case 'output':
                str += 'OUTPUT: ';
                break;
        }
        str += key + ' = ' + BitUtil.hex(entry.value, entry.bitSize) + ' | ';
    }
    Logger.log(0, str);
}

function logClockInfo(clock) {
    if (benchmarkMode) {
        return;
    }
    if (clock) {
        Logger.log(0, ':: CLOCK HIGH');
    } else {
        Logger.log(0, ':: CLOCK LOW - results stored in registers');
    }

}

function logSeparator() {
    var microcodeValue;

    if (benchmarkMode) {
        return;
    }

    microcodeValue = cpuState.extra.microcode.value;
    if (microcodeValue === Microcode.FETCH_FIRST) {
        Logger.log(0, '\n================================================================================\n');
    } else {
        Logger.log(0, '--------------------');
    }
}
