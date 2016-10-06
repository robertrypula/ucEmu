/*
    CPU emulator - 2015.08.15
    ~~~~~~~~~~~~~~~~~~~~~~~~~

    Instruction set:

        -----------+----------------------+----+---------------------------------------+-----------------------------------------------
        cycles     | memory               | nr | instruction                           | action
        -----------+----------------------+----+---------------------------------------+-----------------------------------------------
        ? cycles   | 0x0R 0xRR            | 00 | add     regOut, regIn0, regIn1        | regOut = regIn0 + regIn1
        ? cycles   | 0x1R 0xRR            | 01 | nand    regOut, regIn0, regIn1        | regOut = regIn0 nand regIn1
        ? cycles   | 0x2R 0xRR            | 02 | sh      regOut, regIn0, regIn1        | regOut = (regIn1 >= 0) ? (regIn0 << regIn1) : (regIn0 >>> abs(regIn1))
        ? cycles   | 0x3_ 0xRR            | 03 | jnz     regIn0, regIn1                | if (regIn1 != 0) jump to address from regIn0
        ? cycles   | 0x4R 0xR_            | 04 | copy    regOut, regIn0                | regOut = regIn0
        ? cycles   | 0x5R 0x__ 0xCC 0xCC  | 05 | imm     regOut, _constant16bit_       | regOut = _constant16bit_
        ? cycles   | 0x6_ 0xR_            | 06 | ld      regIn0                        | regMem = MemoryAt[regIn0]
        ? cycles   | 0x7_ 0xR_            | 07 | st      regIn0                        | MemoryAt[regIn0] = regMem
        -----------+----------------------+----+---------------------------------------+-----------------------------------------------

        Alternative version of last three instructions. It can save lot of space in memory after program compilation.

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
        wide so it contains 16384 rows 4 bytes each. It means that we can reduce address bus bits from 16 to 14. In total we will
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
        2 bits power and ground          in - not necessary in emulator
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

        You need 256 cards for 64KB

*/

var Cpu = (function () {
    'use strict';

    _Cpu.$inject = [];

    function _Cpu() {
        var C;

        C = function () {
            this.$$registerBag = RegisterBagBuilder.build();
            this.$$inputBag = InputBagBuilder.build();
            this.$$controlUnit = ControlUnitBuilder.build();
            this.$$internalResultBag = InternalResultBagBuilder.build();
            this.$$outputBag = OutputBagBuilder.build();
            this.$$clockPrevious = this.$$inputBag.clock;

            this.$$microcodeHandler = undefined;
            this.$$instruction = undefined;
            
            this.$$update();
        };

        C.prototype.setMemoryRead = function (memoryRead) {
            this.$$inputBag.memoryRead = memoryRead | 0;
            this.$$update();
        };

        C.prototype.setReset = function (reset) {
            this.$$inputBag.reset = reset ? 1 : 0;
            // reset input is connected directly to the regRegister - no update needed
        };

        C.prototype.setClock = function (clock) {
            this.$$inputBag.clock = clock ? 1 : 0;
            this.$$update();
        };

        C.prototype.getMemoryRowAddress = function () {
            return this.$$outputBag.memoryRowAddress;
        };

        C.prototype.getMemoryWrite = function () {
            return this.$$outputBag.memoryWrite;
        };

        C.prototype.getMemoryWE = function () {
            return this.$$outputBag.memoryWE;
        };

        C.prototype.$$update = function () {
            this.$$microcodeHandler = this.$$controlUnit.getMicrocodeHandler(this.$$registerBag.regSequencer);
            this.$$instruction = this.$$controlUnit.getInstruction(this.$$registerBag.regInstruction, this.$$microcodeHandler);

            this.$$microcodeHandler.propagate(this.$$registerBag, this.$$inputBag, this.$$instruction, this.$$internalResultBag);
            if (this.$$isFallingClockEdge()) {
                this.$$microcodeHandler.storeResults(this.$$internalResultBag, this.$$inputBag.reset, this.$$registerBag);
                this.$$microcodeHandler.propagate(this.$$registerBag, this.$$inputBag, this.$$instruction, this.$$internalResultBag);
            }

            this.$$clockPrevious = this.$$inputBag.clock;
            this.$$outputBag.memoryRowAddress = this.$$registerBag.regMemoryRowAddress;
            this.$$outputBag.memoryWrite = this.$$registerBag.regMemoryWrite;
            this.$$outputBag.memoryWE = this.$$internalResultBag.memoryWE;
        };

        C.prototype.$$isFallingClockEdge = function () {
            return this.$$clockPrevious !== this.$$inputBag.clock && !this.$$inputBag.clock;
        };

        C.prototype.$$loopKeysInsideGroup = function (group, currentState, previousState) {
            var key, current, previous;

            for (key in currentState[group]) {
                if (typeof currentState[group][key].changed !== 'undefined') {
                    current = currentState[group][key];
                    previous = previousState[group][key];
                    current.changed = previousState.value !== current.value;
                }
            }
        };

        C.prototype.getState = function (previousState) {
            var currentState, rf, rb, i, o, group;

            rf = this.$$registerBag.registerFile;
            rb = this.$$registerBag;
            i = this.$$inputBag;
            o = this.$$outputBag;

            currentState = {
                input: {
                    clock: { value: i.clock, bitSize: BitSize.SINGLE_BIT, changed: null },
                    memoryRead: { value: i.memoryRead, bitSize: BitSize.MEMORY_WIDTH, changed: null },
                    reset: { value: i.reset, bitSize: BitSize.SINGLE_BIT, changed: null }
                },
                output: {
                    memoryRowAddress: { value: o.memoryRowAddress, bitSize: BitSize.ADDRESS_ROW, changed: null },
                    memoryWrite: { value: o.memoryWrite, bitSize: BitSize.MEMORY_WIDTH, changed: null },
                    memoryWE: { value: o.memoryWE, bitSize: BitSize.SINGLE_BIT, changed: null }
                },
                registerSpecialPurpose: {
                    regReset: { value: rb.regReset, bitSize: BitSize.SINGLE_BIT, changed: null },
                    regSequencer: { value: rb.regSequencer, bitSize: BitSize.SEQUENCER, changed: null },
                    regInstruction: { value: rb.regInstruction, bitSize: BitSize.MEMORY_WIDTH, changed: null },
                    regClockTick: { value: rb.regClockTick, bitSize: BitSize.MEMORY_WIDTH, changed: null },
                    regMemoryBuffer: { value: rb.regMemoryBuffer, bitSize: BitSize.MEMORY_WIDTH, changed: null },
                    regMemoryRowAddress: { value: rb.regMemoryRowAddress, bitSize: BitSize.ADDRESS_ROW, changed: null },
                    regMemoryWrite: { value: rb.regMemoryWrite, bitSize: BitSize.MEMORY_WIDTH, changed: null }
                },
                registerGeneralPurpose: {
                    reg00: { value: rf.read(0), bitSize: BitSize.REGISTER, changed: null },
                    reg01: { value: rf.read(1), bitSize: BitSize.REGISTER, changed: null },
                    reg02: { value: rf.read(2), bitSize: BitSize.REGISTER, changed: null },
                    reg03: { value: rf.read(3), bitSize: BitSize.REGISTER, changed: null },
                    reg04: { value: rf.read(4), bitSize: BitSize.REGISTER, changed: null },
                    reg05: { value: rf.read(5), bitSize: BitSize.REGISTER, changed: null },
                    reg06: { value: rf.read(6), bitSize: BitSize.REGISTER, changed: null },
                    reg07: { value: rf.read(7), bitSize: BitSize.REGISTER, changed: null },
                    reg08: { value: rf.read(8), bitSize: BitSize.REGISTER, changed: null },
                    reg09: { value: rf.read(9), bitSize: BitSize.REGISTER, changed: null },
                    reg10: { value: rf.read(10), bitSize: BitSize.REGISTER, changed: null },
                    reg11: { value: rf.read(11), bitSize: BitSize.REGISTER, changed: null },
                    reg12: { value: rf.read(12), bitSize: BitSize.REGISTER, changed: null },
                    reg13: { value: rf.read(13), bitSize: BitSize.REGISTER, changed: null },
                    reg14: { value: rf.read(14), bitSize: BitSize.REGISTER, changed: null },
                    regPC: { value: rf.read(15), bitSize: BitSize.REGISTER, changed: null }
                },
                extra: {
                    opcode: { value: this.$$instruction.opcode, changed: null },
                    instructionName: { value: this.$$instruction.name, changed: null },
                    microcode: { value: this.$$microcodeHandler.microcode, changed: null },
                    microcodeName: { value: this.$$microcodeHandler.name, changed: null }
                }
            };

            if (previousState) {
                for (group in currentState) {
                    this.$$loopKeysInsideGroup(group, currentState, previousState);
                }
            }

            return currentState;
        };

        return C;
    }

    return _Cpu();       // TODO change it to dependency injection

})();