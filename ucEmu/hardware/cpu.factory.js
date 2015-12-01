/*
    CPU emulator - 2015.08.15
    ~~~~~~~~~~~~~~~~~~~~~~~~~

    Instruction set:

        -----------+----------------------+----+---------------------------------------+-----------------------------------------------
        cycles     | memory               | nr | instuction                            | action
        -----------+----------------------+----+---------------------------------------+-----------------------------------------------
        ? cycles   | 0x0R 0xRR            | 00 | add     regOut, regIn0, regIn1        | regOut = regIn0 + regIn1
        ? cycles   | 0x1R 0xRR            | 01 | nand    regOut, regIn0, regIn1        | regOut = regIn0 nand regIn1
        ? cycles   | 0x2R 0xRR            | 02 | sh      regOut, regIn0, regIn1        | regOut = (regIn1>=0) ? (regIn0 << regIn1) : (regIn0 >>> abs(regIn1))
        ? cycles   | 0x3_ 0xRR            | 03 | jnz     regIn0, regIn1                | if (regIn1!=0) jump to address from regIn0
        ? cycles   | 0x4R 0xR_            | 04 | copy    regOut, regIn0                | regOut = regIn0
        ? cycles   | 0x5R 0x__ 0xCC 0xCC  | 05 | imm     regOut, _constans16bit_       | regOut = _constans16bit_
        ? cycles   | 0x6_ 0xR_            | 06 | ld      regIn0                        | regMem = MemoryAt[regIn0]
        ? cycles   | 0x7_ 0xR_            | 07 | st      regIn0                        | MemoryAt[regIn0] = regMem
        -----------+----------------------+----+---------------------------------------+-----------------------------------------------

        Alternative version of last three INSTRUCTIONS. It can save lot of space in memory after program compilation.

        ...        | ...                  | .. | ...                                   | ...
        ? cycles   | 0x4R 0xCC 0xCC       | 05 | imm     regOut, _constant16bit_       | regOut = _constant16bit_
        ? cycles   | 0x6R                 | 06 | ld      regIn0                        | regMem = MemoryAt[regIn0]
        ? cycles   | 0x7R                 | 07 | st      regIn0                        | MemoryAt[regIn0] = regMem
        -----------+----------------------+----+---------------------------------------+-----------------------------------------------

    Registers:

        We have 16 registers. Each can hold 16 bits of data.

        reg00-11          Normal
        reg12     regFP   FramePointer
        reg13     regSP   StackPointer
        reg14     regMA   MemoryAccess     (hardware)
        reg15     regPC   ProgramCounter   (hardware)

    Memory:

        Addresses used in the code are 16 bits wide so CPU can access up to 65536 bytes (64 KB). Each memory transfer 16 bits wide 
        so if you address 0x0010 memory row you will get 0x0010 and 0x0011 byte inside register. Memory connected to CPU is 32 bits
        wide so it contains 16384 rows 4 bytes each. It means that we can reduce adress bus bits from 16 to 14. In total we will
        still have 64KB of memory.

        0000: 00 00 00 00
        0004: 00 00 00 00
        0008: 00 00 00 00
        000C: 00 00 00 00
             . . .


        FFD0: po po po po   PORT out - row #0   LCD matrix               ; 1111 1111 1101 0000
        FFD4: po po po po   PORT out - row #1   LCD matrix
        FFD8: po po po po   PORT out - row #2   LCD matrix
        FFDC: po po po po   PORT out - row #3   LCD matrix
        FFE0: po po po po   PORT out - row #4   LCD matrix               ; 1111 1111 1110 0000
        FFE4: po po po po   PORT out - row #5   LCD matrix
        FFE8: po po po po   PORT out - row #6   ---
        FFEC: po po po po   PORT out - row #7   ---
        FFF0: pi pi pi pi   PORT in - row #0    Keyboard                 ; 1111 1111 1111 0000
        FFF4: pi pi pi pi   PORT in - row #1    ---
        FFF8: pi pi pi pi   PORT in - row #2    ---
        FFFC: 00 00 00 00   reserved for 32 bit timer inside CPU

    Pins:

        192 bits of out ports (display)  PORT out 24 bytes
        11 bits in ports (keyboard)      PORT in  1.375 bytes
        2 bits power and ground          in - not nesesary in emulator
        1 bit clock                      in
        1 bit reset                      in
        32 bits memory data in           in
        14 bits memory address           out
        32 bits memory data out          out
        1 bit memory WE                  out

    MainBoard (without IO port pins):
        - 32 bits memory in       4 bytes
        - 32 bits memory out      4 bytes
        - 14 bits memory address  ~2 bytes
        - 1 bit memory write enable
        - 1 bit reset
        - 1 bit clock
        81 bits

        ******** ******** ******** ********
        ******** ******** ******** ********
        ******** ******
        ***

    Card:
        | ******** ****** | * | ******** ******** ******** ******** |
        64 rows * 4 bytes = 256 bytes

        You need 256 cars for 64KB

*/

var Cpu = (function () {
    'use strict';

    _Cpu.$inject = [];

    function _Cpu() {
        var C;

        C = function () {
            this.core = null;
            this.input = null;
            this.output = null;
            this.$$clockPrevious = null;

            this.$$initialize();
            this.$$update();
        };

        C.prototype.setClock = function (clock) {
            this.input.clock = clock ? 1 : 0;
            this.$$update();
        };

        C.prototype.$$initialize = function () {
            this.core = {
                instructionDecoder: InstructionDecoderBuilder.build(this),
                controlUnit: ControlUnitBuilder.build(this),
                alu: AluBuilder.build(),

                // general purpose registers
                registerSet: RegisterSetBuilder.build(),

                // special purpose registers
                regSequencer: BitUtils.random(BitUtils.BYTE_HALF),
                regInstruction: BitUtils.random(BitUtils.BYTE_4),
                regReset: BitUtils.random(BitUtils.BIT_1),
                regMemory: BitUtils.random(BitUtils.BYTE_4),
                regTimer: BitUtils.random(BitUtils.BYTE_4)
            };

            this.input = {
                clock: 0,
                reset: 0,
                memoryRead: 0
            };

            this.output = {
                memoryRowAddress: 0,
                memoryWrite: 0,
                memoryWE: 0
            };
        };

        C.prototype.$$update = function () {

            if (this.$$clockPrevious === null) {
                this.$$clockPrevious = this.input.clock;
            }

            if (this.$$clockPrevious !== this.input.clock) {
                if (this.input.clock) {
                    this.$$clockLowToHigh();
                } else {
                    this.$$clockHighToLow();
                }
                this.$$clockPrevious = this.input.clock;
            }

            this.core.controlUnit.updateOutput();
        };

        C.prototype.$$clockLowToHigh = function () {
            // registers are not changing state during this phase
            // data is passed internally inside master–slave D flip-flop registers
        };

        C.prototype.$$clockHighToLow = function () {
            var resetOccurred = false;

            if (this.core.regReset) {
                this.$$performRegistersReset();
                resetOccurred = true;
            }

            this.core.regReset = this.input.reset;         // store current input
            if (resetOccurred) {
                return;
            }

            this.core.controlUnit.goToNextState();
        };

        C.prototype.$$performRegistersReset = function () {
            this.core.registerSet.reset();

            this.core.regSequencer = 0;
            this.core.regInstruction = 0;

            this.core.regMemory = 0;
            this.core.regTimer = 0;

            // !!! regReset register is excluded from reset !!!
        };

        C.prototype.$$dumpStateLoopGroupKey = function (group, current, previous, callback) {
            var key;

            for (key in current[group]) {
                if (typeof current[group][key].changed !== 'undefined') {
                    callback(current[group][key], previous[group][key]);
                }
            }
        };

        C.prototype.dumpState = function (previous) {
            var dump, rs, c, i, o, id, opcode, key;

            rs = cpu.core.registerSet;
            c = cpu.core;
            i = cpu.input;
            o = cpu.output;
            id = this.core.instructionDecoder;

            opcode = id.getOpcode();

            dump = {
                input: {
                    clock: { value: i.clock, bitSize: BitUtils.BIT_1, changed: null },
                    memoryRead: { value: i.memoryRead, bitSize: BitUtils.BYTE_4, changed: null },
                    reset: { value: i.reset, bitSize: BitUtils.BIT_1, changed: null }
                },
                output: {
                    memoryRowAddress: { value: o.memoryRowAddress, bitSize: BitUtils.BYTE_4 - BitUtils.BIT_2, changed: null },
                    memoryWrite: { value: o.memoryWrite, bitSize: BitUtils.BYTE_4, changed: null },
                    memoryWE: { value: o.memoryWE, bitSize: BitUtils.BIT_1, changed: null }
                },
                registerSpecialPurpose: {
                    regMemory: { value: c.regMemory, bitSize: BitUtils.BYTE_4, changed: null },
                    regSequencer: { value: c.regSequencer, bitSize: BitUtils.BYTE_HALF, changed: null },
                    regInstruction: { value: c.regInstruction, bitSize: BitUtils.BYTE_4, changed: null },
                    regTimer: { value: c.regTimer, bitSize: BitUtils.BYTE_4, changed: null },
                    regReset: { value: c.regReset, bitSize: BitUtils.BIT_1, changed: null }
                },
                registerGeneralPurpose: {
                    reg00: { value: rs.read(0), bitSize: BitUtils.BYTE_2, changed: null },
                    reg01: { value: rs.read(1), bitSize: BitUtils.BYTE_2, changed: null },
                    reg02: { value: rs.read(2), bitSize: BitUtils.BYTE_2, changed: null },
                    reg03: { value: rs.read(3), bitSize: BitUtils.BYTE_2, changed: null },
                    reg04: { value: rs.read(4), bitSize: BitUtils.BYTE_2, changed: null },
                    reg05: { value: rs.read(5), bitSize: BitUtils.BYTE_2, changed: null },
                    reg06: { value: rs.read(6), bitSize: BitUtils.BYTE_2, changed: null },
                    reg07: { value: rs.read(7), bitSize: BitUtils.BYTE_2, changed: null },
                    reg08: { value: rs.read(8), bitSize: BitUtils.BYTE_2, changed: null },
                    reg09: { value: rs.read(9), bitSize: BitUtils.BYTE_2, changed: null },
                    reg10: { value: rs.read(10), bitSize: BitUtils.BYTE_2, changed: null },
                    reg11: { value: rs.read(11), bitSize: BitUtils.BYTE_2, changed: null },
                    reg12: { value: rs.read(12), bitSize: BitUtils.BYTE_2, changed: null },
                    reg13: { value: rs.read(13), bitSize: BitUtils.BYTE_2, changed: null },
                    regMA: { value: rs.read(14), bitSize: BitUtils.BYTE_2, changed: null },
                    regPC: { value: rs.read(15), bitSize: BitUtils.BYTE_2, changed: null }
                },
                extra: {
                    microcodeKey: { value: Microcode.getMicrocodeKey(c.regSequencer), changed: null },
                    opcodeKey: { value: Opcode.getOpcodeKey(opcode), changed: null },
                    instruction: id.getInstruction(opcode)
                }
            };

            // set changed flag
            if (previous) {
                for (key in dump) {
                    this.$$dumpStateLoopGroupKey(key, dump, previous, function (current, previous) {
                        current.changed = previous.value !== current.value;
                    });
                }
            }

            return dump;
        };

        return C;
    }

    return _Cpu();       // TODO change it to dependency injection

})();