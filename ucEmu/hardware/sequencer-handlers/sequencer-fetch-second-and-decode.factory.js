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
                OPCODE;

            checkCpu();
            memoryColumn = cpu.core.registerSet.getProgramCounter() & 3;
            shiftAmount = (4 - memoryColumn) * 8;
            memoryReadShifted = shiftAmount < 32 ? cpu.inputs.memoryRead >>> shiftAmount : 0;
            memoryFinal = memoryReadShifted | cpu.registers.regMemory;
            opCode = (memoryFinal & 0xF0000000) >>> (7 * 4);
            instruction = cpu.core.instructionDecoder.getInstruction(opCode);
            instructionByteWidth = instruction.byteWidth;
            regPCNext = cpu.core.registerSet.getProgramCounter() + instructionByteWidth;
            regSequencerNext = 0;
            OPCODE = cpu.core.instructionDecoder.OPCODE;

            switch (instruction.opcode) {
                case OPCODE.ADD: regSequencerNext = cpu.core.sequencer.STATES.EXECUTE_ADD; break;
                case OPCODE.NAND: regSequencerNext = cpu.core.sequencer.STATES.EXECUTE_NAND; break;
                case OPCODE.SH: regSequencerNext = cpu.core.sequencer.STATES.EXECUTE_SH; break;
                case OPCODE.JNZ: regSequencerNext = cpu.core.sequencer.STATES.EXECUTE_JNZ; break;
                case OPCODE.COPY: regSequencerNext = cpu.core.sequencer.STATES.EXECUTE_COPY; break;
                case OPCODE.IMM: regSequencerNext = cpu.core.sequencer.STATES.EXECUTE_IMM; break;
                case OPCODE.LD: regSequencerNext = cpu.core.sequencer.STATES.EXECUTE_LD_FIRST; break;
                case OPCODE.ST: regSequencerNext = cpu.core.sequencer.STATES.EXECUTE_ST_FIRST; break;
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
