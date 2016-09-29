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

        MFSAD = function () {
            AbstractMicrocode.apply(this, arguments);
        };

        MFSAD.prototype = Object.create(AbstractMicrocode.prototype);
        MFSAD.prototype.constructor = MFSAD;

        MFSAD.prototype.finalizePropagationAndStoreResults = function (registerBag, memoryRead) {
            var column, columnFromTheBack, memoryReadShifted, memoryReadFinal,
                opcode, byteWidth,
                regProgramCounterNext, regMemoryRowAddressNext, regSequencerNext,
                regIn0, regIn0Value;

            column = MemoryController.getColumn(registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER));
            columnFromTheBack = MemoryController.getColumnFromTheBack(column);
            memoryReadShifted = MemoryController.getMemoryReadShiftedRight(columnFromTheBack);
            memoryReadFinal = MemoryController.getMemoryReadFinal(memoryReadShifted, registerBag.regMemoryBuffer);

            opcode = InstructionDecoder.getOpcode(registerBag.regInstruction);
            // instruction = InstructionDecoder.getInstruction(registerBag.regInstruction);
            byteWidth = InstructionDecoder.getByteWidth(registerBag.regInstruction);
            regProgramCounterNext = InstructionDecoder.getProgramCounterNext(registerBag.regInstruction, registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER));
            regSequencerNext = InstructionDecoder.getSequencerNext(registerBag.regInstruction);

            regIn0 = InstructionDecoder.getRegIn0(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.read(regIn0);
            regMemoryRowAddressNext = InstructionDecoder.isLoadOrStoreOpcode(registerBag.regInstruction)
                ? regIn0Value : regProgramCounterNext;

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequenceFetchSecondAndDecode');
                Logger.log(3, 'column = ' + column);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(memoryRead, BitUtil.BYTE_4));
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

            registerBag.registerFile.save(RegisterFile.PROGRAM_COUNTER, regProgramCounterNext);
            registerBag.regClockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            registerBag.regMemoryRowAddress = MemoryController.getMemoryRowAddress(regMemoryRowAddressNext);
            registerBag.regSequencer = regSequencerNext;
            registerBag.regInstruction = memoryReadFinal;
        };

        return MFSAD;
    }

    return _MicrocodeHandlerFetchSecondAndDecode();        // TODO change it to dependency injection

})();