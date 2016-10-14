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
            var column, memoryReadShifted, clockTick, address, register, sequencer, addressRowForAlu, addressRow;

            register = registerBag.registerFile.out0(RegisterFile.DUMMY_REGISTER);

            sequencer = this.microcodeJump === Microcode.JUMP_IS_AT_INSTRUCTION ? instruction.microcodeJump : this.microcodeJump;

            address = registerBag.registerFile.getProgramCounter();
            column = MemoryController.getColumn(address);
            memoryReadShifted = MemoryController.getMemoryReadShiftedLeft(memoryRead, column);

            clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);

            addressRowForAlu = MemoryController.getAddressRowForAlu(address);
            addressRowForAlu = Alu.add(addressRowForAlu, 1);     // TODO add '1' as microcode parameter
            addressRow = MemoryController.getAddressRow(addressRowForAlu);

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
