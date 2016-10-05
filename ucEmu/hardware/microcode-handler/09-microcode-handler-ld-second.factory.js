var MicrocodeHandlerLdSecond = (function () {
    'use strict';

    _MicrocodeHandlerLdSecond.$inject = [];

    function _MicrocodeHandlerLdSecond() {
        var MELS;

        MELS = function (microcode, writeEnablePositive, writeEnableNegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MELS.prototype = Object.create(AbstractMicrocode.prototype);
        MELS.prototype.constructor = MELS;

        MELS.prototype.finalizePropagationAndStoreResults = function (registerBag, inputBag, instruction, internalResultBag) {
            var regIn0, regIn0Value, regOut, regResult, column, columnFromTheBack,
                memoryReadShifted, memoryReadFinal, address;

            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.read(regIn0);

            column = MemoryController.getColumn(regIn0Value);
            columnFromTheBack = MemoryController.getColumnFromTheBack(column);
            memoryReadShifted = MemoryController.getMemoryReadShiftedRight(columnFromTheBack);
            memoryReadFinal = MemoryController.getMemoryReadFinal(memoryReadShifted, registerBag.regMemoryBuffer);

            regResult = memoryReadFinal;           // TODO bug, map memoryReadFinal to register at MemoryController
            regOut = RegisterFile.MEMORY_ACCESS;   // TODO it could be at some point any register...

            // TODO when instruction will save to PC it will produce wrong result - fixed?
            address = RegisterFile.PROGRAM_COUNTER === regOut
                ? regResult : registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER);

            internalResultBag.registerSaveIndex = regOut;
            internalResultBag.register = regResult;
            internalResultBag.sequencer = Microcode.FETCH_FIRST;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            internalResultBag.memoryBuffer = memoryReadFinal;
            internalResultBag.memoryRowAddress = MemoryController.getMemoryRowAddress(address);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
            internalResultBag.writeEnable = MemoryController.getWriteEnable(inputBag.clock, this.writeEnablePositive, this.writeEnableNegative);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'regIn0 = ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitSize.REGISTER));
                Logger.log(3, 'column = ' + column);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(inputBag.memoryRead, BitSize.MEMORY_WIDTH));
                Logger.log(3, 'columnFromTheBack = ' + columnFromTheBack);
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitSize.MEMORY_WIDTH));
                Logger.log(3, 'memoryReadFinal = ' + BitUtil.hex(memoryReadFinal, BitSize.MEMORY_WIDTH));
            }

            if (registerBag.regReset) {
                registerBag.resetAll();
            } else {
                registerBag.registerFile.save(
                    internalResultBag.registerSaveIndex,
                    internalResultBag.register
                );
                registerBag.regSequencer = internalResultBag.sequencer;
                registerBag.regInstruction = internalResultBag.instruction;
                registerBag.regClockTick = internalResultBag.clockTick;
                registerBag.regMemoryBuffer = internalResultBag.memoryBuffer;
                registerBag.regMemoryRowAddress = internalResultBag.memoryRowAddress;
                registerBag.regMemoryWrite = internalResultBag.memoryWrite;
            }
            registerBag.regReset = inputBag.reset;
        };

        return MELS;
    }

    return _MicrocodeHandlerLdSecond();        // TODO change it to dependency injection

})();
