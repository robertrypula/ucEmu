var MicrocodeHandlerLdFirst = (function () {
    'use strict';

    _MicrocodeHandlerLdFirst.$inject = [];

    function _MicrocodeHandlerLdFirst() {
        var MELF;

        MELF = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MELF.prototype = Object.create(AbstractMicrocode.prototype);
        MELF.prototype.constructor = MELF;

        MELF.prototype.propagateNewRegisterData = function (registerBag, memoryRead, instruction, internalResultBag) {
            var regIn0, addressByteReg, memoryReadPhaseOne, dummyRegisterValue, addressByteNextRow;

            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            addressByteReg = registerBag.registerFile.out0(regIn0);
            dummyRegisterValue = registerBag.registerFile.out0(RegisterFile.DUMMY_REGISTER);

            memoryReadPhaseOne = MemoryController.getMemoryReadPhaseOne(addressByteReg, memoryRead);

            addressByteNextRow = Alu.add(addressByteReg, CpuBitSize.MEMORY_COLUMN_IN_ROW);

            internalResultBag.registerSaveIndex = RegisterFile.DUMMY_REGISTER;
            internalResultBag.register = dummyRegisterValue;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.memoryBuffer = memoryReadPhaseOne;
            internalResultBag.memoryRowAddress = MemoryController.getAddressRow(addressByteNextRow);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MELF;
    }

    return _MicrocodeHandlerLdFirst();        // TODO change it to dependency injection

})();
