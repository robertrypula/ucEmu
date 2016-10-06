var MicrocodeHandlerFetchFirst = (function () {
    'use strict';

    _MicrocodeHandlerFetchFirst.$inject = [];

    function _MicrocodeHandlerFetchFirst() {
        var MFF;

        MFF = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MFF.prototype = Object.create(AbstractMicrocode.prototype);
        MFF.prototype.constructor = MFF;

        MFF.prototype.propagate = function (registerBag, inputBag, instruction, internalResultBag) {
            var column, memoryReadShifted, clockTick, address, dummyRegisterValue, sequencer;

            address = registerBag.registerFile.outAddress(RegisterFile.PROGRAM_COUNTER);
            dummyRegisterValue = registerBag.registerFile.out0(RegisterFile.DUMMY_REGISTER);

            sequencer = this.microcodeJump === Microcode.JUMP_IS_AT_INSTRUCTION
                ? instruction.microcodeJump : this.microcodeJump;

            column = MemoryController.getColumn(address);
            memoryReadShifted = MemoryController.getMemoryReadShiftedLeft(inputBag.memoryRead, column);
            clockTick = registerBag.regClockTick;

            internalResultBag.registerSaveIndex = RegisterFile.DUMMY_REGISTER;
            internalResultBag.register = dummyRegisterValue;
            internalResultBag.sequencer = sequencer;
            internalResultBag.instruction = memoryReadShifted;
            internalResultBag.clockTick = ClockTick.getClockTickNext(clockTick);
            internalResultBag.memoryBuffer = memoryReadShifted;
            internalResultBag.memoryRowAddress = MemoryController.getMemoryRowAddressNextRow(address);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
            internalResultBag.memoryWE = MemoryController.getMemoryWE(inputBag.clock, this.memoryWEPositive, this.memoryWENegative);
        };

        return MFF;
    }

    return _MicrocodeHandlerFetchFirst();        // TODO change it to dependency injection

})();
