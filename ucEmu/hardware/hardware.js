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
    + move instruction set creation to control unit
    + split instructions into separate classes like opcode handlers
    + change 'instruction decoder' service name to some 'instruction register spliter'
    + move output update to cpu
    + new parameter or microcode handlers (instruction), fix undefined methods errors
    + add WE clock flags to the microcodeHandlers
    + create RegisterBag class
    + move common bit sizes to dedicated service
    + move register reset to microcode handlers
    + create virtual NotYetDecoded instruction for fetch-first microcode phase
    + microcode handlers should use internalResultBag
    + split data propagation and data storing at microcode handlers
    + split data propagation and data storing at CPU
    + add microcode jump to microcode handler itself (we have also extra Microcode.??)
    + registerFile instead of single read should have channels like: out0, out1, outAddress
    + remove MemoryAccess register approach (also from docs across files)

    - change jnz to jz
    - add background color to changed log entries
    - figure out how to load regClockTick (check row address 0xFFF at memory controller?)
    - improve performance by spiting 'propagate' method into propagateDataNeededAtFallingClockEdge, propagateDataNeededAtClockLevel
    - implement store instruction
    - any register support at ld/st
    
        :: fun starts here ::
    - [1.5h] add DI and clean up
    - [?.?h] test performance with dedicated Register and Signal classes (masking by bitSize and toString would be inside)
    - [1.0h] move project to separate GitHub repo ('SimpleCPU')
 */

// 3.95 emulated MHz / second @ 3.6 GHz real cpu      # old score
// 2.35 emulated MHz / second @ 3.6 GHz real cpu      # current score 2016-09-21
// 4.50 emulated MHz / second @ 3.6 GHz real cpu      # current score 2016-09-22
// 3.90 emulated MHz / second @ 3.6 GHz real cpu      # current score 2016-09-30
// 3.90 emulated MHz / second @ 3.6 GHz real cpu      # current score 2016-09-30
// 0.80 emulated MHz / second @ 3.6 GHz real cpu      # current score 2016-10-06   performance drooped a lot... :(

var
    benchmarkMode = null,//0.8,
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
    Logger.log(0, '\n\n***************\nSTART\n***************\n\n');
    runCpu();
    secondsEnd = new Date().getTime();
    Logger.log(0, '\n\n*************************\nSTOP ' + (secondsEnd - secondsStart) + ' ms\n*************************\n\n');
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
    logCpuStateGroup('registerSpecialPurpose');
    logCpuStateGroup('registerGeneralPurpose');
    logCpuStateExtraGroup();
    logCpuStateGroup('output');

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
