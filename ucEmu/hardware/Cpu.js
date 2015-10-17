'use strict';

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


    var Cpu = function () {

        var self = this;

        this.SEQUENCER_STATES = {
            FETCH_FIRST: 0x00,
            FETCH_SECOND_AND_DECODE: 0x01,
            EXECUTE_ADD: 0x02,
            EXECUTE_NAND: 0x03,
            EXECUTE_SH: 0x04,
            EXECUTE_JNZ: 0x05,
            EXECUTE_COPY: 0x06,
            EXECUTE_IMM: 0x07,
            EXECUTE_LD_FIRST: 0x08,
            EXECUTE_LD_SECOND: 0x09,
            EXECUTE_ST_FIRST: 0x0a,
            EXECUTE_ST_SECOND: 0x0b,
            EXECUTE_ST_THIRD: 0x0c,
            EXECUTE_ST_FOURTH: 0x0d
        };

        this.SPECIAL_REGISTERS = {
            REG_PC: {
                number: 15,
                name: "ProgramCounter"
            },
            REG_MA: {
                number: 14,
                name: "MemoryAccess"
            },
        };

        this.INSTRUCTIONS = {
            ADD: {
                opcode: 0,
                name: 'add',
                nameFull: 'Addition',
                cycles: 0,
                byteWidth: 2
            },
            NAND: {
                opcode: 1,
                name: 'nand',
                nameFull: 'Bitwise NAND',
                cycles: 0,
                byteWidth: 2
            },
            SH: {
                opcode: 2,
                name: 'sh',
                nameFull: "Logical bit shift",
                cycles: 0,
                byteWidth: 2
            },
            JNZ: {
                opcode: 3,
                name: 'jnz',
                nameFull: "Jump if not zero",
                cycles: 0,
                byteWidth: 2
            },
            COPY: {
                opcode: 4,
                name: 'copy',
                nameFull: "Copy",
                cycles: 0,
                byteWidth: 2
            },
            IMM: {
                opcode: 5,
                name: 'imm',
                nameFull: "Immediate value",
                cycles: 0,
                byteWidth: 4
            },
            LD: {
                opcode: 6,
                name: 'ld',
                nameFull: "Load",
                cycles: 0,
                byteWidth: 2
            },
            ST: {
                opcode: 7,
                name: 'st',
                nameFull: "Store",
                cycles: 0,
                byteWidth: 2
            }
        };

        this.inputs = {
            clock: false,
            reset: false,
            memoryRead: 0x00000000
        };

        this.outputs = {
            memoryRowAddress: 0x0000,
            memoryWrite: 0x00000000,
            memoryWE: false,

            portRow00: 0x00000000,
            portRow01: 0x00000000,
            portRow02: 0x00000000,
            portRow03: 0x00000000,
            portRow04: 0x00000000,
            portRow05: 0x00000000,
            portRow06: 0x00000000,
            portRow07: 0x00000000
        };

        this.outputPortsRegisters = {
            regPortRow00: 0xFFFFFFFF & Math.random() * 0x100000000,
            regPortRow01: 0xFFFFFFFF & Math.random() * 0x100000000,
            regPortRow02: 0xFFFFFFFF & Math.random() * 0x100000000,
            regPortRow03: 0xFFFFFFFF & Math.random() * 0x100000000,
            regPortRow04: 0xFFFFFFFF & Math.random() * 0x100000000,
            regPortRow05: 0xFFFFFFFF & Math.random() * 0x100000000,
            regPortRow06: 0xFFFFFFFF & Math.random() * 0x100000000,
            regPortRow07: 0xFFFFFFFF & Math.random() * 0x100000000
        };

        this.registers = {
            // data registers
            reg00: 0xFFFF & Math.random() * 0x10000,
            reg01: 0xFFFF & Math.random() * 0x10000,
            reg02: 0xFFFF & Math.random() * 0x10000,
            reg03: 0xFFFF & Math.random() * 0x10000,
            reg04: 0xFFFF & Math.random() * 0x10000,
            reg05: 0xFFFF & Math.random() * 0x10000,
            reg06: 0xFFFF & Math.random() * 0x10000,
            reg07: 0xFFFF & Math.random() * 0x10000,
            reg08: 0xFFFF & Math.random() * 0x10000,
            reg09: 0xFFFF & Math.random() * 0x10000,
            reg10: 0xFFFF & Math.random() * 0x10000,
            reg11: 0xFFFF & Math.random() * 0x10000,
            reg12: 0xFFFF & Math.random() * 0x10000,
            reg13: 0xFFFF & Math.random() * 0x10000,
            regMA: 0xFFFF & Math.random() * 0x10000,
            regPC: 0xFFFF & Math.random() * 0x10000,

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


        this.boot = function () {
            self.update();
        };

        this.update = function () {

            if (clockPrevious === null) {
                clockPrevious = this.inputs.clock;
            }

            if (clockPrevious !== this.inputs.clock) {
                if (this.inputs.clock) {
                    clockLowToHigh();
                } else {
                    clockHighToLow();
                }
                clockPrevious = this.inputs.clock;
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

            sequencerDispatcher();
            
            self.registers.regTimer = self.registers.regTimer + 1;  // TODO increase timer - check it
        }

        function sequencerDispatcher() 
        {
            switch (self.registers.regSequencer) {
                case self.SEQUENCER_STATES.FETCH_FIRST: 
                    sequenceFetchFirst();
                    break;
                case self.SEQUENCER_STATES.FETCH_SECOND_AND_DECODE: 
                    sequenceFetchSecondAndDecode();
                    break;
                case self.SEQUENCER_STATES.EXECUTE_ADD: 
                    sequencerExecuteAdd();
                    break;
                case self.SEQUENCER_STATES.EXECUTE_NAND: 
                    sequencerExecuteNand();
                    break;
                case self.SEQUENCER_STATES.EXECUTE_SH: 
                    sequencerExecuteSh();
                    break;
                case self.SEQUENCER_STATES.EXECUTE_JNZ: 
                    sequencerExecuteJnz();
                    break;
                case self.SEQUENCER_STATES.EXECUTE_COPY: 
                    sequencerExecuteCopy();
                    break;
                case self.SEQUENCER_STATES.EXECUTE_IMM: 
                    sequencerExecuteImm();
                    break;
                case self.SEQUENCER_STATES.EXECUTE_LD_FIRST: 
                    sequencerExecuteLdFirst();
                    break;
                case self.SEQUENCER_STATES.EXECUTE_LD_SECOND: 
                    sequencerExecuteLdSecond();
                    break;
                case self.SEQUENCER_STATES.EXECUTE_ST_FIRST: 
                    sequencerExecuteStFirst();
                    break;
                case self.SEQUENCER_STATES.EXECUTE_ST_SECOND: 
                    sequencerExecuteStSecond();
                    break;
                case self.SEQUENCER_STATES.EXECUTE_ST_THIRD: 
                    sequencerExecuteStThird();
                    break;
                case self.SEQUENCER_STATES.EXECUTE_ST_FOURTH:
                    sequencerExecuteStFourth();
                    break;
            }
        }

        function performRegistersReset()
        {
            self.registers.reg00 = 0x0000;
            self.registers.reg01 = 0x0000;
            self.registers.reg02 = 0x0000;
            self.registers.reg03 = 0x0000;
            self.registers.reg04 = 0x0000;
            self.registers.reg05 = 0x0000;
            self.registers.reg06 = 0x0000;
            self.registers.reg07 = 0x0000;
            self.registers.reg08 = 0x0000;
            self.registers.reg09 = 0x0000;
            self.registers.reg10 = 0x0000;
            self.registers.reg11 = 0x0000;
            self.registers.reg12 = 0x0000;
            self.registers.reg13 = 0x0000;
            self.registers.regMA = 0x0000;
            self.registers.regPC = 0x0000;

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
                case self.SEQUENCER_STATES.FETCH_FIRST:
                    result = self.registers.regPC >>> 2;
                    break;
                case self.SEQUENCER_STATES.FETCH_SECOND_AND_DECODE:
                    result = (self.registers.regPC >>> 2) + 1;
                    break;
                case self.SEQUENCER_STATES.EXECUTE_LD_FIRST:
                    regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4);
                    regIn0Value = readRegister(regIn0);
                    result = regIn0Value >>> 2;
                    break;
                case self.SEQUENCER_STATES.EXECUTE_LD_SECOND:
                    regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4);
                    regIn0Value = readRegister(regIn0);
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

        function sequenceFetchFirst()
        {
            console.log('    :: sequenceFetchFirst');
            var memoryColumn = self.registers.regPC & 3,
                memoryReadShifted = self.inputs.memoryRead << (memoryColumn * 8)
            ;

            console.log('    memoryColumn = ' + dumpHex(memoryColumn));
            console.log('    inputs.memoryRead = ' + dumpHex(self.inputs.memoryRead));
            console.log('    memoryReadShifted = ' + dumpHex(memoryReadShifted));

            self.registers.regMemory = memoryReadShifted;
            self.registers.regSequencer = self.SEQUENCER_STATES.FETCH_SECOND_AND_DECODE;
        }

        function sequenceFetchSecondAndDecode()
        {
            console.log('    :: sequenceFetchSecondAndDecode');
            var memoryColumn = self.registers.regPC & 3,
                shiftAmount = (4 - memoryColumn) * 8,
                memoryReadShifted = shiftAmount < 32 ? 
                    self.inputs.memoryRead >>> shiftAmount :
                    0,
                memoryFinal = memoryReadShifted | self.registers.regMemory,
                opCode = (memoryFinal & 0xF0000000) >>> (7 * 4),
                instructionDetails = getInstructionDetails(opCode),
                instructionByteWidth = instructionDetails ? instructionDetails.byteWidth : 0,
                regPCNext = self.registers.regPC + instructionByteWidth,
                regSequencerNext = 0
            ;

            switch (opCode) {
                case self.INSTRUCTIONS.ADD.opcode: regSequencerNext = self.SEQUENCER_STATES.EXECUTE_ADD; break;
                case self.INSTRUCTIONS.NAND.opcode: regSequencerNext = self.SEQUENCER_STATES.EXECUTE_NAND; break;
                case self.INSTRUCTIONS.SH.opcode: regSequencerNext = self.SEQUENCER_STATES.EXECUTE_SH; break;
                case self.INSTRUCTIONS.JNZ.opcode: regSequencerNext = self.SEQUENCER_STATES.EXECUTE_JNZ; break;
                case self.INSTRUCTIONS.COPY.opcode: regSequencerNext = self.SEQUENCER_STATES.EXECUTE_COPY; break;
                case self.INSTRUCTIONS.IMM.opcode: regSequencerNext = self.SEQUENCER_STATES.EXECUTE_IMM; break;
                case self.INSTRUCTIONS.LD.opcode: regSequencerNext = self.SEQUENCER_STATES.EXECUTE_LD_FIRST; break;
                case self.INSTRUCTIONS.ST.opcode: regSequencerNext = self.SEQUENCER_STATES.EXECUTE_ST_FIRST; break;
            }

            console.log('    memoryColumn = ' + memoryColumn);
            console.log('    inputs.memoryRead = ' + dumpHex(self.inputs.memoryRead));
            console.log('    shiftAmount = ' + shiftAmount);
            console.log('    memoryReadShifted = ' + dumpHex(memoryReadShifted));
            console.log('    memoryFinal = ' + dumpHex(memoryFinal));
            console.log('    opCode = ' + opCode);
            console.log('    instructionDetails = ', instructionDetails);
            console.log('    instructionByteWidth = ' + instructionByteWidth);
            console.log('    regPCNext = ' + dumpHex(regPCNext));
            console.log('    regSequencerNext = ' + dumpHex(regSequencerNext));

            self.registers.regInstruction = memoryFinal;
            self.registers.regPC = regPCNext;
            self.registers.regSequencer = regSequencerNext;

            /*
            RAM content:
                0x00 0x00 0xaa 0xbb
                0xcc 0xdd 0x00 0x00

            Fetch first
                0xaa 0xbb ____ ____     << aCol with zero fill

            Fetch second
                ____ ____ 0xcc 0xdd     >> 4-aCol width zero fill
            */
        }

        function sequencerExecuteAdd()
        {
            console.log('    :: sequencerExecuteAdd');
            var regOut = (self.registers.regInstruction & 0x0F000000) >>> (6 * 4),
                regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4),
                regIn1 = (self.registers.regInstruction & 0x000F0000) >>> (4 * 4),
                regIn0Value = readRegister(regIn0),
                regIn1Value = readRegister(regIn1),
                regResult = ((regIn1Value & 0xFFFF) + (regIn0Value & 0xFFFF)) & 0xFFFF
            ;

            console.log('    regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    regIn1Value = ' + dumpHex(regIn1Value));
            console.log('    result = ' + dumpHex(regResult) + ' (sum)');

            self.registers.regSequencer = self.SEQUENCER_STATES.FETCH_FIRST;
            saveRegister(regOut, regResult);
        }

        function sequencerExecuteNand()
        {
            console.log('    :: sequencerExecuteNand');
            var regOut = (self.registers.regInstruction & 0x0F000000) >>> (6 * 4),
                regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4),
                regIn1 = (self.registers.regInstruction & 0x000F0000) >>> (4 * 4),
                regIn0Value = readRegister(regIn0),
                regIn1Value = readRegister(regIn1),
                regResult = (~(regIn1Value & regIn0Value)) & 0xFFFF
            ;

            console.log('    regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    regIn1Value = ' + dumpHex(regIn1Value));
            console.log('    result = ' + dumpHex(regResult) + ' (NAND)');

            self.registers.regSequencer = self.SEQUENCER_STATES.FETCH_FIRST;
            saveRegister(regOut, regResult);
        }

        function sequencerExecuteSh()
        {
            console.log('    :: sequencerExecuteSh');
            var regOut = (self.registers.regInstruction & 0x0F000000) >>> (6 * 4),
                regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4),
                regIn1 = (self.registers.regInstruction & 0x000F0000) >>> (4 * 4),
                regIn0Value = readRegister(regIn0),
                regIn1Value = readRegister(regIn1),
                regIn1ValueAbs = regIn1Value & 0x8000 ? 
                    ((~regIn1Value) + 1) & 0xFFFF : 
                    regIn1Value,
                regResult = regIn1ValueAbs < 32 ? 
                    (regIn1Value & 0x8000 ? regIn0Value >>> regIn1ValueAbs : regIn0Value << regIn1Value) & 0xFFFF :
                    0
            ;

            console.log('    regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    regIn1Value = ' + dumpHex(regIn1Value));
            console.log('    regIn1ValueAbs = ' + dumpHex(regIn1ValueAbs));
            console.log('    result = ' + dumpHex(regResult) + ' (BIT SHIFT)');

            self.registers.regSequencer = self.SEQUENCER_STATES.FETCH_FIRST;
            saveRegister(regOut, regResult);
        }

        function sequencerExecuteJnz()
        {
            console.log('    :: sequencerExecuteJnz');
            var regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4),
                regIn1 = (self.registers.regInstruction & 0x000F0000) >>> (4 * 4),
                regIn0Value = readRegister(regIn0),
                regIn1Value = readRegister(regIn1),
                notZeroFlag = regIn1Value !== 0,
                regPCNext = notZeroFlag ? regIn0Value : self.registers.regPC
            ;

            console.log('    regIn0, regIn1 <-> ' + regIn0 + ', ' + regIn1);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    regIn1Value = ' + dumpHex(regIn1Value));
            console.log('    notZeroFlag = ' + (notZeroFlag ? "true (regIn1Value NOT EQUAL zero - jump)" : "false (regIn1Value EQUAL zero - no jump)"));
            console.log('    regPCNext = ' + dumpHex(regPCNext));

            self.registers.regSequencer = self.SEQUENCER_STATES.FETCH_FIRST;
            saveRegister(self.SPECIAL_REGISTERS.REG_PC.number, regPCNext);
        }

        function sequencerExecuteCopy()
        {
            console.log('    :: sequencerExecuteCopy');
            var regOut = (self.registers.regInstruction & 0x0F000000) >>> (6 * 4),
                regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4),
                regIn0Value = readRegister(regIn0)
            ;

            console.log('    regOut, regIn0 <-> ' + regOut + ', ' + regIn0);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value) + " (COPY, save regIn0Value at regOut)");

            self.registers.regSequencer = self.SEQUENCER_STATES.FETCH_FIRST;
            saveRegister(regOut, regIn0Value);
        }

        function sequencerExecuteImm()
        {
            console.log('    :: sequencerExecuteImm');
            var regOut = (self.registers.regInstruction & 0x0F000000) >>> (6 * 4),
                imm = self.registers.regInstruction & 0x0000FFFF
            ;

            console.log('    regOut = ' + regOut);
            console.log('    imm = ' + dumpHex(imm) + " (store immmediate value at regOut)");

            self.registers.regSequencer = self.SEQUENCER_STATES.FETCH_FIRST;
            saveRegister(regOut, imm);
        }
        
        function sequencerExecuteLdFirst()
        {
            console.log('    :: sequencerExecuteLdFirst');
            var regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4),
                regIn0Value = readRegister(regIn0),
                memoryColumn = regIn0Value & 3,
                memoryReadShifted = self.inputs.memoryRead << (memoryColumn * 8)
            ;

            console.log('    regIn0 = ' + regIn0);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    memoryColumn = ' + dumpHex(memoryColumn));
            console.log('    inputs.memoryRead = ' + dumpHex(self.inputs.memoryRead));
            console.log('    memoryReadShifted = ' + dumpHex(memoryReadShifted));

            self.registers.regMemory = memoryReadShifted;
            self.registers.regSequencer = self.SEQUENCER_STATES.EXECUTE_LD_SECOND;
        }
                    
        function sequencerExecuteLdSecond()
        {
            console.log('    :: sequencerExecuteLdSecond');
            var regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4),
                regIn0Value = readRegister(regIn0),
                memoryColumn = regIn0Value & 3,
                shiftAmount = (4 - memoryColumn) * 8,
                memoryReadShifted = shiftAmount < 32 ? 
                    self.inputs.memoryRead >>> shiftAmount :
                    0,
                regMANext = (memoryReadShifted | self.registers.regMemory) >>> (2 * 8)
            ;

            console.log('    regIn0 = ' + regIn0);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    memoryColumn = ' + memoryColumn);
            console.log('    inputs.memoryRead = ' + dumpHex(self.inputs.memoryRead));
            console.log('    shiftAmount = ' + shiftAmount);
            console.log('    memoryReadShifted = ' + dumpHex(memoryReadShifted));
            console.log('    regMANext = ' + dumpHex(regMANext));

            saveRegister(self.SPECIAL_REGISTERS.REG_MA.number, regMANext);
            self.registers.regSequencer = self.SEQUENCER_STATES.FETCH_FIRST;
        }
                    
        function sequencerExecuteStFirst()
        {
            console.log('    :: sequencerExecuteStFirst');

            /*
            RAM content:
                0x12 0x34 0x56 0x78
                0x9a 0xbc 0xde 0xff

            Data to write 0x61 0x72

            :: 1

                12 34 56 78   ram read  (row + 0)
                11 11 11 00   ram mask           (00 00 11 11 >> col, ones fill)
                12 34 56 00   ram read & ram mask
    
                00 00 00 61   dataWriteShifted   (dataWrite >> col, zeros fill)

                12 34 56 61   dataWriteShifted | (ram read & ram mask) a

            :: 1a

                data write (WE == true and clock)

            :: 1b

                data hold (WE == false)

            :: 2

                9a bc de ff   ram read  (row + 1)
                00 11 11 11   ram mask           (00 00 11 11 << (4 - col), ones fill)
                00 bc de ff   ram read & ram mask
    
                72 00 00 00   dataWriteShifted   (dataWrite << (4 - col), zeros fill)

                72 bc de ff   dataWriteShifted | (ram read & ram mask) 

            :: 2a

                data write (WE == true and clock)

            :: 2b

                data hold (WE == false)

            */



        }
                    
        function sequencerExecuteStSecond()
        {
            console.log('    :: sequencerExecuteStSecond');
        }
                    
        function sequencerExecuteStThird()
        {
            console.log('    :: sequencerExecuteStThird');
        }
                    
        function sequencerExecuteStFourth()
        {
            console.log('    :: sequencerExecuteStFourth');
        }

        function getInstructionDetails(opcode) 
        {
            switch (opcode) {
                case 0: return self.INSTRUCTIONS.ADD; break;
                case 1: return self.INSTRUCTIONS.NAND; break;
                case 2: return self.INSTRUCTIONS.SH; break;
                case 3: return self.INSTRUCTIONS.JNZ; break;
                case 4: return self.INSTRUCTIONS.COPY; break;
                case 5: return self.INSTRUCTIONS.IMM; break;
                case 6: return self.INSTRUCTIONS.LD; break;
                case 7: return self.INSTRUCTIONS.ST; break;
            }
        }

        function readRegister(number) 
        {
            var value = null

            switch (number) {
                case 0: value = self.registers.reg00; break;
                case 1: value = self.registers.reg01; break;
                case 2: value = self.registers.reg02; break;
                case 3: value = self.registers.reg03; break;
                case 4: value = self.registers.reg04; break;
                case 5: value = self.registers.reg05; break;
                case 6: value = self.registers.reg06; break;
                case 7: value = self.registers.reg07; break;
                case 8: value = self.registers.reg08; break;
                case 9: value = self.registers.reg09; break;
                case 10: value = self.registers.reg10; break;
                case 11: value = self.registers.reg11; break;
                case 12: value = self.registers.reg12; break;
                case 13: value = self.registers.reg13; break;
                case 14: value = self.registers.regMA; break;
                case 15: value = self.registers.regPC; break;
                default: throw 'ReadRegister - Bad number: ' + number;
            }

            return value & 0xFFFF;
        }

        function saveRegister(number, value)
        {
            value = 0xFFFF & value;
            switch (number) {
                case 0: self.registers.reg00 = value; break;
                case 1: self.registers.reg01 = value; break;
                case 2: self.registers.reg02 = value; break;
                case 3: self.registers.reg03 = value; break;
                case 4: self.registers.reg04 = value; break;
                case 5: self.registers.reg05 = value; break;
                case 6: self.registers.reg06 = value; break;
                case 7: self.registers.reg07 = value; break;
                case 8: self.registers.reg08 = value; break;
                case 9: self.registers.reg09 = value; break;
                case 10: self.registers.reg10 = value; break;
                case 11: self.registers.reg11 = value; break;
                case 12: self.registers.reg12 = value; break;
                case 13: self.registers.reg13 = value; break;
                case 14: self.registers.regMA = value; break;
                case 15: self.registers.regPC = value; break;
                default: throw 'SaveRegister - Bad number ' + number;
            }
        }

        this.boot();
    };
