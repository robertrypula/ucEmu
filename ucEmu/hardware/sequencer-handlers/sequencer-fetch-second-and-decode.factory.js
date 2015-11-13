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

        SFSAD = function (cpu) {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SFSAD.prototype = Object.create(AbstractSequencerHandler.prototype);
        SFSAD.prototype.constructor = SFSAD;

        SFSAD.prototype.$$goToNextState = function () {
            var memoryColumn, shiftAmount, memoryReadShifted, memoryFinal,
                opCode, instruction, instructionByteWidth,
                regPCNext, regSequencerNext,
                OPCODES, STATE;

            memoryColumn = BitUtils.mask(this.$$cpu.core.registerSet.getProgramCounter(), BitUtils.BIT_2);
            shiftAmount = (4 - memoryColumn) * BitUtils.BYTE_1;
            memoryReadShifted = BitUtils.shiftRight(this.$$cpu.inputs.memoryRead, shiftAmount);
            memoryFinal = memoryReadShifted | this.$$cpu.registers.regMemory;
            opCode = this.$$cpu.core.instructionDecoder.getOpcode();
            instruction = this.$$cpu.core.instructionDecoder.getInstruction(opCode);
            instructionByteWidth = instruction.byteWidth;
            regPCNext = BitUtils.mask(this.$$cpu.core.registerSet.getProgramCounter() + instructionByteWidth, BitUtils.BYTE_2);
            regSequencerNext = 0;
            OPCODES = this.$$cpu.core.instructionDecoder.OPCODES;
            STATE = this.$$cpu.core.sequencer.STATE;

            switch (instruction.opcode) {
                case OPCODES.ADD: regSequencerNext = STATE.EXECUTE_ADD; break;
                case OPCODES.NAND: regSequencerNext = STATE.EXECUTE_NAND; break;
                case OPCODES.SH: regSequencerNext = STATE.EXECUTE_SH; break;
                case OPCODES.JNZ: regSequencerNext = STATE.EXECUTE_JNZ; break;
                case OPCODES.COPY: regSequencerNext = STATE.EXECUTE_COPY; break;
                case OPCODES.IMM: regSequencerNext = STATE.EXECUTE_IMM; break;
                case OPCODES.LD: regSequencerNext = STATE.EXECUTE_LD_FIRST; break;
                case OPCODES.ST: regSequencerNext = STATE.EXECUTE_ST_FIRST_A; break;
            }

            console.log('    :: sequenceFetchSecondAndDecode');
            console.log('    memoryColumn = ' + memoryColumn);
            console.log('    inputs.memoryRead = ' + BitUtils.hex(this.$$cpu.inputs.memoryRead, BitUtils.BYTE_4));
            console.log('    shiftAmount = ' + shiftAmount);
            console.log('    memoryReadShifted = ' + BitUtils.hex(memoryReadShifted, BitUtils.BYTE_4));
            console.log('    memoryFinal = ' + BitUtils.hex(memoryFinal, BitUtils.BYTE_4));
            console.log('    opCode = ' + opCode);
            console.log('    instruction = ', instruction);
            console.log('    instructionName = ', instruction.name + ', ' + instruction.nameFull);
            console.log('    instructionByteWidth = ' + instructionByteWidth);
            console.log('    regPCNext = ' + BitUtils.hex(regPCNext, BitUtils.BYTE_2));
            console.log('    regSequencerNext = ' + BitUtils.hex(regSequencerNext, BitUtils.BYTE_HALF));

            this.$$cpu.registers.regInstruction = memoryFinal;
            this.$$cpu.core.registerSet.setProgramCounter(regPCNext);
            this.$$cpu.registers.regSequencer = regSequencerNext;
        };


        SFSAD.prototype.$$updateOutputMemoryRowAddress = function () {
            this.$$cpu.outputs.memoryRowAddress = BitUtils.shiftRight(this.$$cpu.core.registerSet.getProgramCounter(), BitUtils.BIT_2) + 1;
        };

        return SFSAD;
    }

    return _SequencerFetchSecondAndDecode();        // TODO change it do dependency injection

})();
