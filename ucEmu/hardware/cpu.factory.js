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

        Address bus is 16 bits wide so CPU can access up to 65536 bytes (64 KB). Each memory transfer 16 bits wide so if you
        address 0x0010 memory row you will get 0x0010 and 0x0011 byte inside register. Memory connected to CPU is 32 bits
        wide so it contains 16384 rows 4 bytes each.

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
        16 bits memory data in           in
        16 bits memory address           out
        16 bits memory data out          out
        1 bit memory WE                  out

*/

var Cpu = (function () {
    'use strict';

    var Cpu = function () {
        var self = this;

        self.core = {
            registerSet: new RegisterSet(),
            instructionDecoder: new InstructionDecoder(),
            sequencer: new Sequencer()
        };

        self.inputs = {
            clock: false,
            reset: false,
            memoryRead: 0x00000000
        };

        self.outputs = {
            memoryRowAddress: 0x0000,
            memoryWrite: 0x00000000,
            memoryWE: false
        };

        self.registers = {
            // control registers
            regSequencer: 0xF & Math.random() * 0x10,
            regInstruction: 0xFFFF & Math.random() * 0x10000,

            // input helper registers
            regReset: Math.random() >= 0.5,
            regMemory: 0xFFFFFFFF & Math.random() * 0x100000000,

            // timer
            regTimer: 0xFFFFFFFF & Math.random() * 0x100000000
        };

        var clockPrevious = null;


        self.construct = function () {
            self.core.sequencer.setCpu(self);
            self.update();
        };

        self.update = function () {

            if (clockPrevious === null) {
                clockPrevious = self.inputs.clock;
            }

            if (clockPrevious !== self.inputs.clock) {
                if (self.inputs.clock) {
                    clockLowToHigh();
                } else {
                    clockHighToLow();
                }
                clockPrevious = self.inputs.clock;
            }

            updateOutputs();
        };

        function clockLowToHigh()
        {
            // nothing is happening here - data is passed internally inside master–slave D flip-flop registers
        }

        function clockHighToLow()
        {
            var resetOccured = false;

            if (self.registers.regReset) {
                performRegistersReset();
                resetOccured = true;
            }

            self.registers.regReset = self.inputs.reset;         // store current input
            if (resetOccured) {
                return;
            }

            self.core.sequencer.dispatch(self.registers.regSequencer);

            self.registers.regTimer = self.registers.regTimer + 1;  // TODO increase timer - check it
        }

        function performRegistersReset()
        {
            self.core.registerSet.reset();

            self.registers.regSequencer = 0x00;
            self.registers.regInstruction = 0x0000;

            self.registers.regMemory = 0x00000000;
            self.registers.regTimer = 0x00000000;

            // !!! regReset register is excluded from reset !!!
        }

        function updateOutputs()
        {
            updateOutputMemoryRowAddress();
            updateOutputMemoryWrite();
            updateOutputMemoryWE();
        }

        function updateOutputMemoryRowAddress()
        {
            var result,
                regIn0,
                regIn0Value;

            switch (self.registers.regSequencer) {
                case self.core.sequencer.STATES.FETCH_FIRST:
                    result = self.core.registerSet.getProgramCounter() >>> 2;
                    break;
                case self.core.sequencer.STATES.FETCH_SECOND_AND_DECODE:
                    result = (self.core.registerSet.getProgramCounter() >>> 2) + 1;
                    break;
                case self.core.sequencer.STATES.EXECUTE_LD_FIRST:
                    regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4);
                    regIn0Value = self.core.registerSet.read(regIn0);
                    result = regIn0Value >>> 2;
                    break;
                case self.core.sequencer.STATES.EXECUTE_LD_SECOND:
                    regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4);
                    regIn0Value = self.core.registerSet.read(regIn0);
                    result = (regIn0Value >>> 2) + 1;
                    break;
                // TODO implement ld/st instructions
                default:
                    result = 0x0000;            // floating bus - pulled down by resistors
            }

            self.outputs.memoryRowAddress = result;
        }

        function updateOutputMemoryWrite()
        {
            var result;

            switch (self.registers.regSequencer) {
                default:
                    result = 0x00000000;  // TODO implement st instruction
            }

            self.outputs.memoryWrite = result;
        }

        function updateOutputMemoryWE()
        {
            var result;

            switch (self.registers.regSequencer) {
                default:
                    result = false;          // TODO implement st instruction
            }

            self.outputs.memoryWE = result;
        }

        self.construct();
    };

    return Cpu;       // TODO change it do dependency injection

})();
