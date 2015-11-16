/*
    TODO:
        Code refactor:
            + [0.50h] move output computing to handlers (default value at abstract)
            + [0.25h] remember to update outputs when cpu boots because we dont have faling edge at thus point
            + [1.00h] remove dumpHex and use hex
            + [0.50h] new services for object creation (remove all 'new' aross code), AluProvider.create(cpu) / AluCreator.create(cpu) / AluBuilder.create()
            + [0.75h] service for logging with verbose levels
            - [0.50h] move inputs at the top of the log, and header like 'Cpu state after blablba'
            - [0.25h] WE and with clock (B positive clock, C negative clock)
            - [0.75h] rename sequencer handler to some microCode blabla?
               still needed total: 1.50h

                :: fun starts here ::
            - [2.00h] create MainBoard factory instead boot.js - first step only move existing functionality
            - [x.xxh] fix load instruction to access Timer
            - [2.00h] signal class?
            - [x.xxh] module approach with update and input changed checking

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
    {row: 0x0004, data: [0x70, 0x10, 0xaa, 0xaa]},
    {row: 0x0005, data: [0xaa, 0xaa, 0xaa, 0xaa]},
    {row: 0x0006, data: [0xaa, 0xaa, 0xaa, 0xaa]}
];
var cpu = new Cpu();
var staticRam = new StaticRam(
    cpu.outputs.memoryRowAddress,
    cpu.outputs.memoryWE,
    cpu.outputs.memoryWrite
);
globalUpdate();
cpuLog();

triggerCpuResetAndProgramStaticRam();

cpu.registers.regPC = 0;
globalUpdate();

runCpu();

function triggerCpuResetAndProgramStaticRam()
{
    Logger.log(1, ':: trigger RESET AND PROGRAM STARTS');

    cpu.inputs.reset = true;
    clockHigh();
    clockLow();

    programStaticRamAndSync(memoryState);

    cpu.inputs.reset = false;
    clockHigh();
    clockLow();

    Logger.log(1, ':: trigger RESET AND PROGRAM ENDS');
    Logger.log(1, "\n\n");
}

function runCpu()
{
    var clockTicks = 0;

    while (clockTicks < 30 * 10) {
        clockTicks++;
        clockHigh();
        clockLow();

        Logger.log(1, '----> clockTicks ' + clockTicks);
        Logger.log(1, "\n");
        
        if (cpu.registers.regSequencer == cpu.core.sequencer.STATE.FETCH_FIRST) {
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
    staticRam.setWriteEnable(false);
    for (var i = 0; i < memoryState.length; i++) {
        var ms = memoryState[i];

        staticRam.setRow(ms.row);
        staticRam.setDataIn(BitUtils.byteRowTo32bit(ms.data));
        staticRam.setWriteEnable(true);
        staticRam.setWriteEnable(false);
    }
    syncCpuWithStaticRam();
}

function syncCpuWithStaticRam()
{
    staticRam.setRow(cpu.outputs.memoryRowAddress);
    staticRam.setWriteEnable(cpu.outputs.memoryWE);
    staticRam.setDataIn(cpu.outputs.memoryWrite);

    cpu.inputs.memoryRead = staticRam.getDataOut();
}

function clockHigh()
{
    cpu.inputs.clock = true;
    globalUpdate();
    // cpuLog();
}

function clockLow()
{
    cpu.inputs.clock = false;
    globalUpdate();
    cpuLog();
}

function globalUpdate()
{
    cpu.update();
    syncCpuWithStaticRam();
}

function cpuLog()
{
    var rs = cpu.core.registerSet,
        r = cpu.registers;

    Logger.log(
        1,
        'in.clock: ' + cpu.inputs.clock + ' | ' +
        'in.memoryRead = ' + BitUtils.hex(cpu.inputs.memoryRead, BitUtils.BYTE_4) + ' | ' +
        'in.reset = ' + BitUtils.hex(cpu.inputs.reset, BitUtils.BIT_1) + '      ' +
        'out.memoryRowAddress = ' + BitUtils.hex(cpu.outputs.memoryRowAddress, BitUtils.BYTE_4 - BitUtils.BIT_2) + ' | ' +
        'out.memoryWrite = ' + BitUtils.hex(cpu.outputs.memoryWrite, BitUtils.BYTE_4) + ' | ' +
        'out.memoryWE = ' + BitUtils.hex(cpu.outputs.memoryWE, BitUtils.BIT_1) + ' | '
    );
    Logger.log(
        1,
        'regMemory = ' + BitUtils.hex(r.regMemory, BitUtils.BYTE_4) + ' | ' +
        'regSequencer = ' + BitUtils.hex(r.regSequencer, BitUtils.BYTE_HALF) + ' | ' +
        'regInstruction = ' + BitUtils.hex(r.regInstruction, BitUtils.BYTE_4) + ' | ' +
        'regTimer = ' + BitUtils.hex(r.regTimer, BitUtils.BYTE_4) + ' | ' +
        'regReset = ' + BitUtils.hex(r.regReset, BitUtils.BIT_1)
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
}

staticRam.log(0, 3);
