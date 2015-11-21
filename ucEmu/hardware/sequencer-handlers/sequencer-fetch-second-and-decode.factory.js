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
                opCode, instructionByteWidth,
                regPCNext, regSequencerNext;

            memoryColumn = BitUtils.mask(this.$$regSet.getProgramCounter(), BitUtils.BIT_2);
            shiftAmount = (4 - memoryColumn) * BitUtils.BYTE_1;
            memoryReadShifted = BitUtils.shiftRight(this.$$in.memoryRead, shiftAmount);
            memoryFinal = memoryReadShifted | this.$$reg.regMemory;
            opCode = this.$$insDec.getOpcode();
            // instruction = this.$$insDec.getInstruction(opCode);
            instructionByteWidth = this.$$insDec.getByteWidth(opCode);
            regPCNext = BitUtils.mask(this.$$regSet.getProgramCounter() + instructionByteWidth, BitUtils.BYTE_2);
            regSequencerNext = 0;

            switch (opCode) {
                case this.$$insDecOPCODE.ADD: regSequencerNext = this.$$seqSTATE.EXECUTE_ADD; break;
                case this.$$insDecOPCODE.NAND: regSequencerNext = this.$$seqSTATE.EXECUTE_NAND; break;
                case this.$$insDecOPCODE.SH: regSequencerNext = this.$$seqSTATE.EXECUTE_SH; break;
                case this.$$insDecOPCODE.JNZ: regSequencerNext = this.$$seqSTATE.EXECUTE_JNZ; break;
                case this.$$insDecOPCODE.COPY: regSequencerNext = this.$$seqSTATE.EXECUTE_COPY; break;
                case this.$$insDecOPCODE.IMM: regSequencerNext = this.$$seqSTATE.EXECUTE_IMM; break;
                case this.$$insDecOPCODE.LD: regSequencerNext = this.$$seqSTATE.EXECUTE_LD_FIRST; break;
                case this.$$insDecOPCODE.ST: regSequencerNext = this.$$seqSTATE.EXECUTE_ST_FIRST_A; break;
            }

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequenceFetchSecondAndDecode');
                Logger.log(3, 'memoryColumn = ' + memoryColumn);
                Logger.log(3, 'inputs.memoryRead = ' + BitUtils.hex(this.$$in.memoryRead, BitUtils.BYTE_4));
                Logger.log(3, 'shiftAmount = ' + shiftAmount);
                Logger.log(3, 'memoryReadShifted = ' + BitUtils.hex(memoryReadShifted, BitUtils.BYTE_4));
                Logger.log(3, 'memoryFinal = ' + BitUtils.hex(memoryFinal, BitUtils.BYTE_4));
                Logger.log(3, 'opCode = ' + opCode);
                // Logger.log(0, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'instructionByteWidth = ' + instructionByteWidth);
                Logger.log(3, 'regPCNext = ' + BitUtils.hex(regPCNext, BitUtils.BYTE_2));
                Logger.log(3, 'regSequencerNext = ' + BitUtils.hex(regSequencerNext, BitUtils.BYTE_HALF));
            }

            this.$$reg.regInstruction = memoryFinal;
            this.$$regSet.setProgramCounter(regPCNext);
            this.$$reg.regSequencer = regSequencerNext;
        };


        SFSAD.prototype.$$updateOutputMemoryRowAddress = function () {
            this.$$out.memoryRowAddress = BitUtils.shiftRight(this.$$regSet.getProgramCounter(), BitUtils.BIT_2) + 1;
        };

        return SFSAD;
    }

    return _SequencerFetchSecondAndDecode();        // TODO change it do dependency injection

})();
