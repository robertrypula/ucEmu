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

        MFF.prototype.propagateNewRegisterData = function (registerBag, memoryRead, instruction, internalResultBag) {
            var memoryReadShifted, clockTick, addressByte, register, sequencer, addressRowAsWord, addressRow;

            register = registerBag.registerFile.out0(RegisterFile.DUMMY_REGISTER);

            sequencer = this.microcodeJump === Microcode.JUMP_IS_AT_INSTRUCTION ? instruction.microcodeJump : this.microcodeJump;

            addressByte = registerBag.registerFile.getProgramCounter();
            memoryReadShifted = MemoryController.getMemoryReadShiftedPhaseOne(addressByte, memoryRead);

            clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);

            addressRowAsWord = MemoryController.getAddressRowAsWord(addressByte);
            addressRowAsWord = Alu.add(addressRowAsWord, 1);     // TODO add '1' as microcode parameter
            addressRow = MemoryController.getAddressRowFromAddressRowAsWord(addressRowAsWord);

            internalResultBag.registerSaveIndex = RegisterFile.DUMMY_REGISTER;
            internalResultBag.register = register;
            internalResultBag.sequencer = sequencer;
            internalResultBag.instruction = memoryReadShifted;      // TODO add dedicated signal and splitter from memoryReadShifted
            internalResultBag.clockTick = clockTick;
            internalResultBag.memoryBuffer = memoryReadShifted;
            internalResultBag.memoryRowAddress = addressRow;
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MFF;
    }

    return _MicrocodeHandlerFetchFirst();        // TODO change it to dependency injection

})();
