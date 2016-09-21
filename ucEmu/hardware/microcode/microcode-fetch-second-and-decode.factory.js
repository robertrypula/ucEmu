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
            var column, columnFromTheBack, memoryReadShifted, memoryReadFinal,
                opcode, byteWidth,
                regProgramCounterNext, regSequencerNext;

            column = this.$$mc.getColumn(this.$$regFile.getProgramCounter());
            columnFromTheBack = this.$$mc.getColumnFromTheBack(column);
            memoryReadShifted = this.$$mc.getMemoryReadShiftedRight(columnFromTheBack);
            memoryReadFinal = this.$$mc.getMemoryReadFinal(memoryReadShifted);
            opcode = this.$$insDec.getOpcode();
            // instruction = this.$$insDec.getInstruction(opcode);
            byteWidth = this.$$insDec.getByteWidth(opcode);
            regProgramCounterNext = this.$$insDec.getProgramCounterNext(opcode);
            regSequencerNext = this.$$insDec.getSequencerNext(opcode);

            if (Logger.isEnabled()) {
                Logger.log(2, '[ACTION] sequenceFetchSecondAndDecode');
                Logger.log(3, 'column = ' + column);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(this.$$in.memoryRead, BitUtil.BYTE_4));
                Logger.log(3, 'columnFromTheBack = ' + columnFromTheBack);
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitUtil.BYTE_4));
                Logger.log(3, 'memoryReadFinal = ' + BitUtil.hex(memoryReadFinal, BitUtil.BYTE_4));
                Logger.log(3, 'opcode = ' + opcode);
                // Logger.log(0, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'byteWidth = ' + byteWidth);
                Logger.log(3, 'regProgramCounterNext = ' + BitUtil.hex(regProgramCounterNext, BitUtil.BYTE_2));
                Logger.log(3, 'regSequencerNext = ' + BitUtil.hex(regSequencerNext, BitUtil.BYTE_HALF));
            }

            this.$$core.regInstruction = memoryReadFinal;
            this.$$regFile.setProgramCounter(regProgramCounterNext);
            this.$$core.regSequencer = regSequencerNext;
        };
        
        MFSAD.prototype.$$updateOutputMemoryRowAddress = function () {
            this.$$out.memoryRowAddress = this.$$mc.getMemoryRowAddressNext(this.$$regFile.getProgramCounter());
        };

        return MFSAD;
    }

    return _MicrocodeFetchSecondAndDecode();        // TODO change it to dependency injection

})();
