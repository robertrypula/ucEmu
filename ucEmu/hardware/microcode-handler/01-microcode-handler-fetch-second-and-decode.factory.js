var MicrocodeHandlerFetchSecondAndDecode = (function () {
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

    _MicrocodeHandlerFetchSecondAndDecode.$inject = [];

    function _MicrocodeHandlerFetchSecondAndDecode() {
        var MFSAD;

        MFSAD = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MFSAD.prototype = Object.create(AbstractMicrocode.prototype);
        MFSAD.prototype.constructor = MFSAD;

        MFSAD.prototype.finalizePropagationAndStoreResults = function () {
            var column, columnFromTheBack, memoryReadShifted, memoryReadFinal,
                opcode, byteWidth,
                regProgramCounterNext, regMemoryRowAddressNext, regSequencerNext,
                regIn0, regIn0Value;

            column = MemoryController.getColumn(this.$$regFile.getProgramCounter());
            columnFromTheBack = MemoryController.getColumnFromTheBack(column);
            memoryReadShifted = MemoryController.getMemoryReadShiftedRight(columnFromTheBack);
            memoryReadFinal = MemoryController.getMemoryReadFinal(memoryReadShifted, this.$$core.regMemoryBuffer);

            opcode = InstructionDecoder.getOpcode(this.$$core.regInstruction);
            // instruction = InstructionDecoder.getInstruction(this.$$core.regInstruction);
            byteWidth = InstructionDecoder.getByteWidth(this.$$core.regInstruction);
            regProgramCounterNext = InstructionDecoder.getProgramCounterNext(this.$$core.regInstruction, this.$$regFile.getProgramCounter());
            regSequencerNext = InstructionDecoder.getSequencerNext(this.$$core.regInstruction);

            regIn0 = InstructionDecoder.getRegIn0(this.$$core.regInstruction);
            regIn0Value = this.$$regFile.read(regIn0);
            regMemoryRowAddressNext = InstructionDecoder.isLoadOrStoreOpcode(this.$$core.regInstruction)
                ? regIn0Value : regProgramCounterNext;

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequenceFetchSecondAndDecode');
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
                Logger.log(3, 'regIn0 = ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2));
                Logger.log(3, 'regMemoryRowAddressNext = ' + BitUtil.hex(regMemoryRowAddressNext, BitUtil.BYTE_2 - BitUtil.BIT_2));
            }

            this.$$regFile.setProgramCounter(regProgramCounterNext);
            this.$$core.regClockTick = ClockTick.getClockTickNext(this.$$core.regClockTick);
            this.$$core.regMemoryRowAddress = MemoryController.getMemoryRowAddress(regMemoryRowAddressNext);
            this.$$core.regSequencer = regSequencerNext;
            this.$$core.regInstruction = memoryReadFinal;
        };

        return MFSAD;
    }

    return _MicrocodeHandlerFetchSecondAndDecode();        // TODO change it to dependency injection

})();
