/*
    TODO:
        Code refactor:
            + [0.50h] move output computing to handlers (default value at abstract)
            + [0.25h] remember to update output when cpu boots because we dont have faling edge at thus point
            + [1.00h] remove dumpHex and use hex
            + [0.50h] new services for object creation (remove all 'new' aross code), AluProvider.create(cpu) / AluCreator.create(cpu) / AluBuilder.create()
            + [0.75h] service for logging with verbose levels
            + [0.50h] add aliases for cpu internals at abstract-sequencer-handler, CHECK PERFORNANCE -> no change :/
            + [0.50h] rename sequencer handler to some microCode blabla?
                        + sequencer -> ControlUnit
                        + serquencer-handler -> microcode
                        + handler@sequencer -> controlStore
                        + STATE@seqauencer -> MICROCODE
                        + STATE@sequencerBuilder -> moved to ControlUnit
                        + state param @sequencerBuilder.build() -> microcode

            - [0.50h] move input at the top of the log, and header like 'Cpu state after blablba'
                + create dumpState method that returns array with name, value, and bitSize - all divided into sections register, input, output, extra
                - ability to pass previous dumpState to mark changes values - changed = true/false/null
                + move Instructon State and Microcode State to separate file (also method for fetching key by value)
                + return instr/microcode state at extra field in cpu dump

            - [0.25h] WE and with clock (B positive clock, C negative clock)
            - [0.50h] fix load instruction to access Timer 
             
               still needed total: 1.25h

                :: fun starts here ::
            - [2.00h] create MainBoard factory instead boot.js - first step only move existing functionality
            - [2.00h] signal class?
            - [x.xxh] module approach with update and input changed checking
                        - Signals at module.input[] should have reference to parent module to run update() method
                        - for CPU factory it means that we could remove manual update() calling - we could only watch clock input signal
                        - module aproach is about refresing output after input is changed (internals are not important)

        Integrate IO with existing code for dot matrix and keyboard
            - [x.xxh] MainBoard should expose programming interface and events when input/output was changed
              ...

 */

/*
 ? cycles   | 0x0R 0xRR            | 00 | add     regOut, regIn0, regIn1        | regOut = regIn0 + regIn1
 ? cycles   | 0x1R 0xRR            | 01 | nand    regOut, regIn0, regIn1        | regOut = regIn0 nand regIn1
 ? cycles   | 0x2R 0xRR            | 02 | sh      regOut, regIn0, regIn1        | regOut = (regIn1>=0) ? (regIn0 << regIn1) : (regIn0 >>> abs(regIn1))
 ? cycles   | 0x3_ 0xRR            | 03 | jnz     regIn0, regIn1                | if (regIn1!=0) jump to address from regIn0
 ? cycles   | 0x4R 0xR_            | 04 | copy    regOut, regIn0                | regOut = regIn0
 ? cycles   | 0x5R 0x__ 0xCC 0xCC  | 05 | imm     regOut, _constans16bit_       | regOut = _constans16bit_
 ? cycles   | 0x6_ 0xR_            | 06 | ld      regIn0                        | regMem = MemoryAt[regIn0]
 ? cycles   | 0x7_ 0xR_            | 07 | st      regIn0                        | MemoryAt[regIn0] = regMem
 */

var memoryState = [
    {row: 0x0000, data: [0x00, 0x00, 0x10, 0x00]},
    {row: 0x0001, data: [0x20, 0x00, 0x30, 0x07]},
    {row: 0x0002, data: [0x45, 0x00, 0x50, 0x00]},
    {row: 0x0003, data: [0xff, 0xff, 0x60, 0x10]},
    {row: 0x0004, data: [0x70, 0x10, 0x55, 0x00]},
    {row: 0x0005, data: [0x00, 0x01, 0x56, 0x00]},
    {row: 0x0006, data: [0x00, 0x12, 0x30, 0x65]}
];
Logger.setVerbose(4);
var cpu = new Cpu();
var staticRam = new StaticRam(
    cpu.output.memoryRowAddress,
    cpu.output.memoryWE,
    cpu.output.memoryWrite
);
syncCpuWithStaticRam();
cpu.setClock(false);
cpuLog();

triggerCpuResetAndProgramStaticRam();
cpu.setClock(false);
syncCpuWithStaticRam();
cpu.setClock(false);
syncCpuWithStaticRam();

var secondsStart = new Date().getTime();
document.write('START<br/>');
runCpu();

var secondsEnd = new Date().getTime();
document.write('STOP<br/> ' + (secondsEnd - secondsStart) + ' ms');


function triggerCpuResetAndProgramStaticRam()
{
    Logger.log(1, ':: trigger RESET AND PROGRAM STARTS');

    cpu.input.reset = true;
    clockHigh();
    clockLow();

    programStaticRamAndSync(memoryState);

    cpu.input.reset = false;
    clockHigh();
    clockLow();

    Logger.log(1, ':: trigger RESET AND PROGRAM ENDS');
    Logger.log(1, "\n\n");
}

function runCpu()
{
    var clockTicks = 0;

    // 3.95 emulated MHz @ 3.6 GHz real cpu    
    //         -> JavaScript requires ~1000 cycler per each emulated cycle

    while (clockTicks < /*Math.round(3.95 * 1000 * 1000)*/30) {      // 30
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
                '                               clockTicks: ' + BitUtils.hex(clockTicks, BitUtils.BYTE_4)
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

function programStaticRamAndSync(memoryState)
{
    for (var i = 0; i < memoryState.length; i++) {
        var ms = memoryState[i];

        staticRam.setWriteEnable(false);

        staticRam.setRow(ms.row);
        staticRam.setDataIn(BitUtils.byteRowTo32bit(ms.data));

        staticRam.setWriteEnable(true);
        staticRam.setWriteEnable(false);
    }
    syncCpuWithStaticRam();
}

function syncCpuWithStaticRam()
{
    staticRam.setRow(cpu.output.memoryRowAddress);
    staticRam.setDataIn(cpu.output.memoryWrite);
    staticRam.setWriteEnable(cpu.output.memoryWE);

    cpu.input.memoryRead = staticRam.getDataOut();
}

function clockHigh()
{
    cpu.setClock(true);
    syncCpuWithStaticRam();

    /*
    if (Logger.isEnabled()) {
        cpuLog();
    }
    */
}

function clockLow()
{
    cpu.setClock(false);
    syncCpuWithStaticRam();

    if (Logger.isEnabled()) {
        cpuLog();
    }
}

function cpuLog()
{
    var rs = cpu.core.registerSet,
        c = cpu.core;

    Logger.log(
        1,
        'in.clock: ' + cpu.input.clock + ' | ' +
        'in.memoryRead = ' + BitUtils.hex(cpu.input.memoryRead, BitUtils.BYTE_4) + ' | ' +
        'in.reset = ' + BitUtils.hex(cpu.input.reset, BitUtils.BIT_1) + '      ' +
        'out.memoryRowAddress = ' + BitUtils.hex(cpu.output.memoryRowAddress, BitUtils.BYTE_4 - BitUtils.BIT_2) + ' | ' +
        'out.memoryWrite = ' + BitUtils.hex(cpu.output.memoryWrite, BitUtils.BYTE_4) + ' | ' +
        'out.memoryWE = ' + BitUtils.hex(cpu.output.memoryWE, BitUtils.BIT_1) + ' | '
    );
    Logger.log(
        1,
        'regMemory = ' + BitUtils.hex(c.regMemory, BitUtils.BYTE_4) + ' | ' +
        'regSequencer = ' + BitUtils.hex(c.regSequencer, BitUtils.BYTE_HALF) + ' | ' +
        'regInstruction = ' + BitUtils.hex(c.regInstruction, BitUtils.BYTE_4) + ' | ' +
        'regTimer = ' + BitUtils.hex(c.regTimer, BitUtils.BYTE_4) + ' | ' +
        'regReset = ' + BitUtils.hex(c.regReset, BitUtils.BIT_1)
    );
    Logger.log(
        1,
        'reg00 = ' + BitUtils.hex(rs.read(0), BitUtils.BYTE_2) + ' | ' +
        'reg01 = ' + BitUtils.hex(rs.read(1), BitUtils.BYTE_2) + ' | ' +
        'reg02 = ' + BitUtils.hex(rs.read(2), BitUtils.BYTE_2) + ' | ' +
        'reg03 = ' + BitUtils.hex(rs.read(3), BitUtils.BYTE_2) + ' | ' +
        'reg04 = ' + BitUtils.hex(rs.read(4), BitUtils.BYTE_2) + ' | ' +
        'reg05 = ' + BitUtils.hex(rs.read(5), BitUtils.BYTE_2) + ' | ' +
        'reg06 = ' + BitUtils.hex(rs.read(6), BitUtils.BYTE_2) + ' | ' +
        'reg07 = ' + BitUtils.hex(rs.read(7), BitUtils.BYTE_2) + ' | '
    );
    Logger.log(
        1,
        'reg08 = ' + BitUtils.hex(rs.read(8), BitUtils.BYTE_2) + ' | ' +
        'reg09 = ' + BitUtils.hex(rs.read(9), BitUtils.BYTE_2) + ' | ' +
        'reg10 = ' + BitUtils.hex(rs.read(10), BitUtils.BYTE_2) + ' | ' +
        'reg11 = ' + BitUtils.hex(rs.read(11), BitUtils.BYTE_2) + ' | ' +
        'reg12 = ' + BitUtils.hex(rs.read(12), BitUtils.BYTE_2) + ' | ' +
        'reg13 = ' + BitUtils.hex(rs.read(13), BitUtils.BYTE_2) + ' | ' +
        'regMA = ' + BitUtils.hex(rs.getMemoryAccess(), BitUtils.BYTE_2) + ' | ' +
        'regPC = ' + BitUtils.hex(rs.getProgramCounter(), BitUtils.BYTE_2) + ' | '
    );

    console.log(cpu.dumpState());
}

staticRam.log(0, 3);
