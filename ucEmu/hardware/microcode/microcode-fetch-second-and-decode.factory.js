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

            memoryColumn = BitUtil.mask(this.$$regSet.getProgramCounter(), BitUtil.BIT_2);
            shiftAmount = (4 - memoryColumn) * BitUtil.BYTE_1;
            memoryReadShifted = BitUtil.shiftRight(this.$$in.memoryRead, shiftAmount);
            memoryFinal = memoryReadShifted | this.$$core.regMemory;
            opcode = this.$$insDec.getOpcode();
            // instruction = this.$$insDec.getInstruction(opcode);
            instructionByteWidth = this.$$insDec.getByteWidth(opcode);
            regPCNext = BitUtil.mask(this.$$regSet.getProgramCounter() + instructionByteWidth, BitUtil.BYTE_2);
            regSequencerNext = this.$$insDec.getMicrocodeJump(opcode);

            if (Logger.isEnabled()) {
                Logger.log(2, '[ACTION] sequenceFetchSecondAndDecode');
                Logger.log(3, 'memoryColumn = ' + memoryColumn);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(this.$$in.memoryRead, BitUtil.BYTE_4));
                Logger.log(3, 'shiftAmount = ' + shiftAmount);
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitUtil.BYTE_4));
                Logger.log(3, 'memoryFinal = ' + BitUtil.hex(memoryFinal, BitUtil.BYTE_4));
                Logger.log(3, 'opcode = ' + opcode);
                // Logger.log(0, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'instructionByteWidth = ' + instructionByteWidth);
                Logger.log(3, 'regPCNext = ' + BitUtil.hex(regPCNext, BitUtil.BYTE_2));
                Logger.log(3, 'regSequencerNext = ' + BitUtil.hex(regSequencerNext, BitUtil.BYTE_HALF));
            }

            this.$$core.regInstruction = memoryFinal;
            this.$$regSet.setProgramCounter(regPCNext);
            this.$$core.regSequencer = regSequencerNext;
        };


        MFSAD.prototype.$$updateOutputMemoryRowAddress = function () {
            this.$$out.memoryRowAddress = BitUtil.shiftRight(this.$$regSet.getProgramCounter(), BitUtil.BIT_2) + 1;
        };

        return MFSAD;
    }

    return _MicrocodeFetchSecondAndDecode();        // TODO change it to dependency injection

})();
