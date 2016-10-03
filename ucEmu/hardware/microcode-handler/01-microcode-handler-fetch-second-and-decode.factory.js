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

        MFSAD = function (microcode, writeEnablePositive, writeEnableNegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MFSAD.prototype = Object.create(AbstractMicrocode.prototype);
        MFSAD.prototype.constructor = MFSAD;

        MFSAD.prototype.finalizePropagationAndStoreResults = function (registerBag, instruction, memoryRead) {
            var column, columnFromTheBack, memoryReadShifted, memoryReadFinal,
                opcode, byteWidth, programCounter,
                regProgramCounterNext, regMemoryRowAddressNext, regSequencerNext,
                regIn0, regIn0Value;

            column = MemoryController.getColumn(registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER));
            columnFromTheBack = MemoryController.getColumnFromTheBack(column);
            memoryReadShifted = MemoryController.getMemoryReadShiftedRight(columnFromTheBack);
            memoryReadFinal = MemoryController.getMemoryReadFinal(memoryReadShifted, registerBag.regMemoryBuffer);

            opcode = instruction.opcode;
            byteWidth = instruction.byteWidth;
            programCounter = registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER);
            regProgramCounterNext = Alu.add(programCounter, byteWidth);
            regSequencerNext = instruction.microcodeJump;

            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.read(regIn0);
            regMemoryRowAddressNext = instruction.memoryRowAddressFromRegIn0 ? regIn0Value : regProgramCounterNext;

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'column = ' + column);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(memoryRead, BitSize.MEMORY_WIDTH));
                Logger.log(3, 'columnFromTheBack = ' + columnFromTheBack);
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitSize.MEMORY_WIDTH));
                Logger.log(3, 'memoryReadFinal = ' + BitUtil.hex(memoryReadFinal, BitSize.MEMORY_WIDTH));
                Logger.log(3, 'opcode = ' + opcode);
                Logger.log(3, 'byteWidth = ' + byteWidth);
                Logger.log(3, 'programCounter = ' + BitUtil.hex(programCounter, BitSize.REGISTER));
                Logger.log(3, 'regProgramCounterNext = ' + BitUtil.hex(regProgramCounterNext, BitSize.REGISTER));
                Logger.log(3, 'regSequencerNext = ' + BitUtil.hex(regSequencerNext, BitSize.SEQUENCER));
                Logger.log(3, 'regIn0 = ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitSize.REGISTER));
                Logger.log(3, 'regMemoryRowAddressNext = ' + BitUtil.hex(regMemoryRowAddressNext, BitSize.ADDRESS_ROW));
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
