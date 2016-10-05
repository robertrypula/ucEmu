var MicrocodeHandlerLdFirst = (function () {
    'use strict';

    _MicrocodeHandlerLdFirst.$inject = [];

    function _MicrocodeHandlerLdFirst() {
        var MELF;

        MELF = function (microcode, writeEnablePositive, writeEnableNegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MELF.prototype = Object.create(AbstractMicrocode.prototype);
        MELF.prototype.constructor = MELF;

        MELF.prototype.finalizePropagationAndStoreResults = function (registerBag, inputBag, instruction, internalResultBag) {
            var regIn0, address, column, memoryReadShifted, dummyRegisterValue;

            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            address = registerBag.registerFile.read(regIn0);
            dummyRegisterValue = registerBag.registerFile.read(RegisterFile.DUMMY_REGISTER);

            column = MemoryController.getColumn(address);
            memoryReadShifted = MemoryController.getMemoryReadShiftedLeft(inputBag.memoryRead, column);

            internalResultBag.registerSaveIndex = RegisterFile.DUMMY_REGISTER;
            internalResultBag.register = dummyRegisterValue;
            internalResultBag.sequencer = Microcode.LD_SECOND;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            internalResultBag.memoryBuffer = memoryReadShifted;
            internalResultBag.memoryRowAddress = MemoryController.getMemoryRowAddressNextRow(address);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
            internalResultBag.writeEnable = MemoryController.getWriteEnable(inputBag.clock, this.writeEnablePositive, this.writeEnableNegative);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'regIn0 = ' + regIn0);
                Logger.log(3, 'address = ' + BitUtil.hex(address, BitSize.REGISTER));
                Logger.log(3, 'column = ' + column);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(inputBag.memoryRead, BitSize.MEMORY_WIDTH));
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitSize.MEMORY_WIDTH));
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

        return MELF;
    }

    return _MicrocodeHandlerLdFirst();        // TODO change it to dependency injection

})();
