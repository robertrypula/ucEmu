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
    + change jnz to jz
    + add background color to changed log entries
    + reduce byteWidth of imm instruction
    + improve performance by spiting 'propagate' method into propagateDataNeededAtFallingClockEdge, propagateDataNeededAtClockLevel

    - figure out how to load regClockTick (check last row address 0x3FFF at memory controller?)
    - implement store instruction
    - split address propagation to improve performance more?
    
        :: fun starts here ::
    - add DI and clean up
    - test performance with dedicated Register and Signal classes (masking by bitSize and toString would be inside)
    - move project to separate GitHub repo ('SimpleCPU')
 */

// 3.95 emulated MHz / second @ 3.6 GHz real cpu      # old score
// 2.35 emulated MHz / second @ 3.6 GHz real cpu      # current score 2016-09-21
// 4.50 emulated MHz / second @ 3.6 GHz real cpu      # current score 2016-09-22
// 3.90 emulated MHz / second @ 3.6 GHz real cpu      # current score 2016-09-30
// 3.90 emulated MHz / second @ 3.6 GHz real cpu      # current score 2016-09-30
// 0.80 emulated MHz / second @ 3.6 GHz real cpu      # current score 2016-10-06   performance drooped a lot... :(
// 1.65 emulated MHz / second @ 3.6 GHz real cpu      # current score 2016-10-12   little better :)

var
    benchmarkMode = null,//2.50,
    staticRamData = [
        { rowAddress: 0x0000, data: [0x50, 0x00, 0x09, 0x55] },
        { rowAddress: 0x0001, data: [0x00, 0x01, 0x56, 0xFF] },
        { rowAddress: 0x0002, data: [0xFF, 0x59, 0xFF, 0xF1] },
        { rowAddress: 0x0003, data: [0x01, 0x06, 0x57, 0x00] },
        { rowAddress: 0x0004, data: [0x01, 0x5A, 0x00, 0x19] },
        { rowAddress: 0x0005, data: [0x30, 0xA1, 0x57, 0x00] },
        { rowAddress: 0x0006, data: [0x00, 0x5A, 0x00, 0x21] },
        { rowAddress: 0x0007, data: [0x30, 0xA7, 0x5F, 0x00] },
        { rowAddress: 0x0008, data: [0x55, 0x44, 0x00, 0x53] },
        { rowAddress: 0x0009, data: [0x00, 0x00, 0x12, 0x11] },
        { rowAddress: 0x000a, data: [0x02, 0x25, 0x08, 0x42] },
        { rowAddress: 0x000b, data: [0x27, 0x89, 0x5A, 0x00] },
        { rowAddress: 0x000c, data: [0x36, 0x30, 0xA7, 0x5F] },
        { rowAddress: 0x000d, data: [0x00, 0x3D, 0x04, 0x42] },
        { rowAddress: 0x000e, data: [0x03, 0x35, 0x5F, 0x00] },
        { rowAddress: 0x000f, data: [0x26, 0x57, 0x00, 0x01] },
        { rowAddress: 0x0010, data: [0x5A, 0x00, 0x48, 0x30] },
        { rowAddress: 0x0011, data: [0xA4, 0x57, 0x00, 0x00] },
        { rowAddress: 0x0012, data: [0x5A, 0x00, 0x50, 0x30] },
        { rowAddress: 0x0013, data: [0xA7, 0x5F, 0x00, 0x55] },
        { rowAddress: 0x0014, data: [0x01, 0x16, 0x5F, 0x00] },
        { rowAddress: 0x0015, data: [0x0F, 0x5F, 0x00, 0x55] }
    ],
    cpu = new Cpu(),
    staticRam = new StaticRam(),
    secondsStart,
    secondsEnd,
    cpuState,
    cpuStatePrevious,
    fullLog = false;

Logger.setVerbose(benchmarkMode ? -1 : 4);

function initialize() {
    var i;

    fullLog = !!document.getElementById('full-log').checked;

    Logger.clear();
    tryToLoadInputs();

    syncCpuWithStaticRam();
    for (i = 0; i < 2; i++) {
        cpu.setReset(true);
        makeOneClockCycle();
    }

    staticRam.log(0, 22);
    staticRamFillWithData(staticRamData);
    makeOneClockCycle();
    staticRam.log(0, 22);

    cpu.setReset(false);
    makeOneClockCycle();
}

function runAuto() {
    secondsStart = new Date().getTime();
    Logger.log(0, '\n\n***************\nSTART\n***************\n\n');
    runCpu();
    secondsEnd = new Date().getTime();
    Logger.log(0, '\n\n*************************\nSTOP ' + (secondsEnd - secondsStart) + ' ms\n*************************\n\n');
    if (benchmarkMode) {
        cpuState = cpu.getState(cpuStatePrevious);
        alert(
            (secondsEnd - secondsStart) + ' ms. Results at reg01 = ' +
            cpuState.registerGeneralPurpose.reg05.value
        );
    }

    staticRam.log(0, 22);
}

function runStepByStep() {
    Logger.clear();
    staticRam.log(0, 22, cpuState.registerGeneralPurpose.regPC.value);
    while (true) {
        makeOneClockCycle();
        if (cpuState.extra.microcodeJump.value === Microcode.FETCH_FIRST) {
            break;
        }
    }
}

function tryToLoadInputs() {
    var i, j, element, data;

    element = document.getElementById('use-input');
    if (!element.checked) {
        return;
    }

    staticRamData = [];
    for (i = 0; i < 6; i++) {
        element = document.getElementById('input-' + i);
        data = (element.value + '').split(' ');
        for (j = 0; j < data.length; j++) {
            data[j] = parseInt(data[j], 16);
        }
        staticRamData.push(
            { rowAddress: i, data: data }
        );
    }
}

function runCpu() {
    var clockTicks, clockTicksToDo;

    clockTicks = 0;
    clockTicksToDo = benchmarkMode ? Math.round(benchmarkMode * 1000 * 1000) : 400;
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
    logClockLow();

    cpu.setClock(true);
    syncCpuWithStaticRam();

    logClockHigh();

    cpu.setClock(false);
    syncCpuWithStaticRam();

    logAfterClockFallingEdge();
}

function logClockLow() {
    if (fullLog) {
        logSeparator();
        getCpuState();
        staticRam.log(0, 22);
        logCpuStateGroup('registerGeneralPurpose');
        logOneEntry('output', 'memoryRowAddress');
        logOneEntry('input', 'memoryRead');
        logCpuStateGroup('input');
        logCpuStateGroup('registerSpecialPurpose');
        logCpuStateExtraGroup();
        logCpuStateGroup('output');
    } else {
        getCpuState();
        logSeparator();
        logCpuStateGroup('registerGeneralPurpose');
        logOneEntry('output', 'memoryRowAddress');
        logOneEntry('input', 'memoryRead');
        logOneEntry('registerSpecialPurpose', 'regInstruction');
        logCpuStateExtraGroup();
        // TODO add also memory write data
    }
}

function logClockHigh() {
    if (fullLog) {
        logClockInfo(true);
        getCpuState();
        staticRam.log(0, 22);
        logOneEntry('output', 'memoryRowAddress');
        logOneEntry('input', 'memoryRead');
        logCpuStateGroup('output');
        logCpuStateGroup('input');
    } else {
    }
}

function logAfterClockFallingEdge() {
    if (fullLog) {
        logClockInfo(false);
    } else {
    }
}

function getCpuState() {
    if (!benchmarkMode) {
        cpuState = cpu.getState(cpuStatePrevious);
        cpuStatePrevious = cpuState;
    }
}

function wrapWithSpan(html) {
    return '<span style="background-color: rgba(0, 255, 0, 0.3)">' + html + '</span>';
}

function getEntryHtml(key, entry) {
    var entryHtml;

    entryHtml = key + ' = ' + BitUtil.hex(entry.value, entry.bitSize);
    if (entry.changed) {
        entryHtml = wrapWithSpan(entryHtml);
    }

    return entryHtml;
}

function logCpuStateExtraGroup() {
    var html;

    if (benchmarkMode) {
        return;
    }

    html = cpuState.extra.opcode.value + ', ' + cpuState.extra.instructionName.value;
    if (cpuState.extra.opcode.changed) {
        html = wrapWithSpan(html);
    }
    Logger.log(0, ':::: INSTRUCTION: ' + html);

    html = cpuState.extra.microcode.value + ', ' + cpuState.extra.microcodeName.value;
    if (cpuState.extra.microcode.changed) {
        html = wrapWithSpan(html);
    }
    Logger.log(0, ':::: MICROCODE: ' + html);
}

function logOneEntry(groupName, key) {
    var group, entry;

    if (benchmarkMode) {
        return;
    }

    group = cpuState[groupName];
    entry = group[key];
    Logger.log(0, getEntryHtml(key, entry));
}

function logCpuStateGroup(groupName) {
    var group, key, entry, entryHtml, str;

    if (benchmarkMode) {
        return;
    }

    group = cpuState[groupName];
    str = '';
    switch (groupName) {
        case 'input':
            str += 'INPUT: ';
            break;
        case 'output':
            str += 'OUTPUT: ';
            break;
    }
    for (key in group) {
        entry = group[key];
        entryHtml = getEntryHtml(key, entry);
        str += entryHtml + ' | ';
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

    if (benchmarkMode || !cpuState) {
        return;
    }

    microcodeValue = cpuState.extra.microcode.value;
    if (microcodeValue === Microcode.FETCH_FIRST) {
        Logger.log(0, '\n================================================================================\n');
    } else {
        Logger.log(0, '--------------------');
    }
}
