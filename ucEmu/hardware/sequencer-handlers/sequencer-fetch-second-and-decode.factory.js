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

    _SequencerFetchSecondAndDecode.$inject = [];

    function _SequencerFetchSecondAndDecode() {
        var SFSAD;

        SFSAD = function () {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SFSAD.prototype = Object.create(AbstractSequencerHandler.prototype);
        SFSAD.prototype.constructor = SFSAD;

        SFSAD.prototype.$$run = function () {
            var memoryColumn, shiftAmount, memoryReadShifted, memoryFinal,
                opCode, instruction, instructionByteWidth,
                regPCNext, regSequencerNext,
                OPCODES, STATES;

            memoryColumn = BitUtils.mask(this.$$cpu.core.registerSet.getProgramCounter(), BitUtils.BIT_2);
            shiftAmount = (4 - memoryColumn) * BitUtils.BYTE_1;
            memoryReadShifted = BitUtils.shiftRight(this.$$cpu.inputs.memoryRead, shiftAmount);
            memoryFinal = memoryReadShifted | this.$$cpu.registers.regMemory;
            opCode = this.$$cpu.core.instructionDecoder.getOpcode();
            instruction = this.$$cpu.core.instructionDecoder.getInstruction(opCode);
            instructionByteWidth = instruction.byteWidth;
            regPCNext = this.$$cpu.core.registerSet.getProgramCounter() + instructionByteWidth;
            regSequencerNext = 0;
            OPCODES = this.$$cpu.core.instructionDecoder.OPCODES;
            STATES = this.$$cpu.core.sequencer.STATES;

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
            console.log('    inputs.memoryRead = ' + dumpHex(this.$$cpu.inputs.memoryRead));
            console.log('    shiftAmount = ' + shiftAmount);
            console.log('    memoryReadShifted = ' + dumpHex(memoryReadShifted));
            console.log('    memoryFinal = ' + dumpHex(memoryFinal));
            console.log('    opCode = ' + opCode);
            console.log('    instruction = ', instruction);
            console.log('    instructionName = ', instruction.name + ', ' + instruction.nameFull);
            console.log('    instructionByteWidth = ' + instructionByteWidth);
            console.log('    regPCNext = ' + dumpHex(regPCNext));
            console.log('    regSequencerNext = ' + dumpHex(regSequencerNext));

            this.$$cpu.registers.regInstruction = memoryFinal;
            this.$$cpu.core.registerSet.setProgramCounter(regPCNext);
            this.$$cpu.registers.regSequencer = regSequencerNext;
        }

        return SFSAD;
    }

    return _SequencerFetchSecondAndDecode();        // TODO change it do dependency injection

})();
