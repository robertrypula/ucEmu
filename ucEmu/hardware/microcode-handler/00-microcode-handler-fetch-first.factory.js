var MicrocodeHandlerFetchFirst = (function () {
    'use strict';

    _MicrocodeHandlerFetchFirst.$inject = [];

    function _MicrocodeHandlerFetchFirst() {
        var MFF;

        MFF = function (microcode, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MFF.prototype = Object.create(AbstractMicrocode.prototype);
        MFF.prototype.constructor = MFF;

        MFF.prototype.propagate = function (registerBag, inputBag, instruction, internalResultBag) {
            var column, memoryReadShifted, clockTick, address, dummyRegisterValue;

            address = registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER);
            dummyRegisterValue = registerBag.registerFile.read(RegisterFile.DUMMY_REGISTER);

            column = MemoryController.getColumn(address);
            memoryReadShifted = MemoryController.getMemoryReadShiftedLeft(inputBag.memoryRead, column);
            clockTick = registerBag.regClockTick;

            internalResultBag.registerSaveIndex = RegisterFile.DUMMY_REGISTER;
            internalResultBag.register = dummyRegisterValue;
            internalResultBag.sequencer = instruction.microcodeJump;
            internalResultBag.instruction = memoryReadShifted;
            internalResultBag.clockTick = ClockTick.getClockTickNext(clockTick);
            internalResultBag.memoryBuffer = memoryReadShifted;
            internalResultBag.memoryRowAddress = MemoryController.getMemoryRowAddressNextRow(address);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
            internalResultBag.memoryWE = MemoryController.getMemoryWE(inputBag.clock, this.memoryWEPositive, this.memoryWENegative);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'column = ' + column);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(inputBag.memoryRead, BitSize.MEMORY_WIDTH));
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitSize.MEMORY_WIDTH));
            }
        };

        return MFF;
    }

    return _MicrocodeHandlerFetchFirst();        // TODO change it to dependency injection

})();
