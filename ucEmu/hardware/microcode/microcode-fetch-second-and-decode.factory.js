var MicrocodeFetchSecondAndDecode = (function () {
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

    _MicrocodeFetchSecondAndDecode.$inject = [];

    function _MicrocodeFetchSecondAndDecode() {
        var MFSAD;

        MFSAD = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MFSAD.prototype = Object.create(AbstractMicrocode.prototype);
        MFSAD.prototype.constructor = MFSAD;

        MFSAD.prototype.$$goToNextState = function () {
            var memoryColumn, shiftAmount, memoryReadShifted, memoryFinal,
                opcode, instructionByteWidth,
                regPCNext, regSequencerNext;

            memoryColumn = BitUtils.mask(this.$$regSet.getProgramCounter(), BitUtils.BIT_2);
            shiftAmount = (4 - memoryColumn) * BitUtils.BYTE_1;
            memoryReadShifted = BitUtils.shiftRight(this.$$in.memoryRead, shiftAmount);
            memoryFinal = memoryReadShifted | this.$$reg.regMemory;
            opcode = this.$$insDec.getOpcode();
            // instruction = this.$$insDec.getInstruction(opcode);
            instructionByteWidth = this.$$insDec.getByteWidth(opcode);
            regPCNext = BitUtils.mask(this.$$regSet.getProgramCounter() + instructionByteWidth, BitUtils.BYTE_2);
            regSequencerNext = this.$$insDec.getMicrocodeJump(opcode);

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequenceFetchSecondAndDecode');
                Logger.log(3, 'memoryColumn = ' + memoryColumn);
                Logger.log(3, 'input.memoryRead = ' + BitUtils.hex(this.$$in.memoryRead, BitUtils.BYTE_4));
                Logger.log(3, 'shiftAmount = ' + shiftAmount);
                Logger.log(3, 'memoryReadShifted = ' + BitUtils.hex(memoryReadShifted, BitUtils.BYTE_4));
                Logger.log(3, 'memoryFinal = ' + BitUtils.hex(memoryFinal, BitUtils.BYTE_4));
                Logger.log(3, 'opcode = ' + opcode);
                // Logger.log(0, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'instructionByteWidth = ' + instructionByteWidth);
                Logger.log(3, 'regPCNext = ' + BitUtils.hex(regPCNext, BitUtils.BYTE_2));
                Logger.log(3, 'regSequencerNext = ' + BitUtils.hex(regSequencerNext, BitUtils.BYTE_HALF));
            }

            this.$$reg.regInstruction = memoryFinal;
            this.$$regSet.setProgramCounter(regPCNext);
            this.$$reg.regSequencer = regSequencerNext;
        };


        MFSAD.prototype.$$updateOutputMemoryRowAddress = function () {
            this.$$out.memoryRowAddress = BitUtils.shiftRight(this.$$regSet.getProgramCounter(), BitUtils.BIT_2) + 1;
        };

        return MFSAD;
    }

    return _MicrocodeFetchSecondAndDecode();        // TODO change it to dependency injection

})();
