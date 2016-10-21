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
            var memoryReadPhaseOne, addressBytePC, dummyRegisterValue, addressByteNextRow;

            dummyRegisterValue = registerBag.registerFile.out0(RegisterFile.DUMMY_REGISTER);

            addressBytePC = registerBag.registerFile.getProgramCounter();
            memoryReadPhaseOne = MemoryController.getMemoryReadPhaseOne(addressBytePC, memoryRead);

            addressByteNextRow = Alu.add(addressBytePC, CpuBitSize.MEMORY_COLUMN_IN_ROW);

            internalResultBag.registerSaveIndex = RegisterFile.DUMMY_REGISTER;
            internalResultBag.register = dummyRegisterValue;
            internalResultBag.instruction = memoryReadPhaseOne;      // TODO add dedicated signal and splitter from memoryReadPhaseOne
            internalResultBag.memoryBuffer = memoryReadPhaseOne;
            internalResultBag.memoryRowAddress = MemoryController.getAddressRow(addressByteNextRow);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MFF;
    }

    return _MicrocodeHandlerFetchFirst();        // TODO change it to dependency injection

})();
