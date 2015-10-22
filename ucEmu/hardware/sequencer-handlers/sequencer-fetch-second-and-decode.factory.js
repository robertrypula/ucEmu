var SequencerFetchSecondAndDecode = (function () {
    'use strict';

    /*
     RAM content:
     0x00 0x00 0xaa 0xbb
     0xcc 0xdd 0x00 0x00

     Fetch first
     0xaa 0xbb ____ ____     << aCol with zero fill

     Fetch second
     ____ ____ 0xcc 0xdd     >> 4-aCol width zero fill
    */

    var SequencerFetchSecondAndDecode = function () {
        var
            self = this,
            cpu = null
        ;

        self.run = function () {
            var memoryColumn, shiftAmount, memoryReadShifted, memoryFinal,
                opCode, instruction, instructionByteWidth,
                regPCNext, regSequencerNext,
                OPCODES, STATES;

            checkCpu();
            memoryColumn = cpu.core.registerSet.getProgramCounter() & 3;
            shiftAmount = (4 - memoryColumn) * BitUtils.BYTE_1;
            memoryReadShifted = BitUtils.shiftRight(cpu.inputs.memoryRead, shiftAmount);
            memoryFinal = memoryReadShifted | cpu.registers.regMemory;
            opCode = cpu.core.instructionDecoder.getOpcode();
            instruction = cpu.core.instructionDecoder.getInstruction(opCode);
            instructionByteWidth = instruction.byteWidth;
            regPCNext = cpu.core.registerSet.getProgramCounter() + instructionByteWidth;
            regSequencerNext = 0;
            OPCODES = cpu.core.instructionDecoder.OPCODES;
            STATES = cpu.core.sequencer.STATES;

            switch (instruction.opcode) {
                case OPCODES.ADD: regSequencerNext = STATES.EXECUTE_ADD; break;
                case OPCODES.NAND: regSequencerNext = STATES.EXECUTE_NAND; break;
                case OPCODES.SH: regSequencerNext = STATES.EXECUTE_SH; break;
                case OPCODES.JNZ: regSequencerNext = STATES.EXECUTE_JNZ; break;
                case OPCODES.COPY: regSequencerNext = STATES.EXECUTE_COPY; break;
                case OPCODES.IMM: regSequencerNext = STATES.EXECUTE_IMM; break;
                case OPCODES.LD: regSequencerNext = STATES.EXECUTE_LD_FIRST; break;
                case OPCODES.ST: regSequencerNext = STATES.EXECUTE_ST_FIRST; break;
            }

            console.log('    :: sequenceFetchSecondAndDecode');
            console.log('    memoryColumn = ' + memoryColumn);
            console.log('    inputs.memoryRead = ' + dumpHex(cpu.inputs.memoryRead));
            console.log('    shiftAmount = ' + shiftAmount);
            console.log('    memoryReadShifted = ' + dumpHex(memoryReadShifted));
            console.log('    memoryFinal = ' + dumpHex(memoryFinal));
            console.log('    opCode = ' + opCode);
            console.log('    instruction = ', instruction);
            console.log('    instructionByteWidth = ' + instructionByteWidth);
            console.log('    regPCNext = ' + dumpHex(regPCNext));
            console.log('    regSequencerNext = ' + dumpHex(regSequencerNext));

            cpu.registers.regInstruction = memoryFinal;
            cpu.core.registerSet.setProgramCounter(regPCNext);
            cpu.registers.regSequencer = regSequencerNext;
        };

        self.setCpu = function (cpuSelf)
        {
            cpu = cpuSelf;
        };

        function checkCpu()
        {
            if (cpu === null) {
                throw 'Please attach cpu first';
            }
        }
    };

    return SequencerFetchSecondAndDecode;        // TODO change it do dependency injection

})();
