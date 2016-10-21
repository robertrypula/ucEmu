var MicrocodeHandlerStFirstC = (function () {
    'use strict';

    _MicrocodeHandlerStFirstC.$inject = [];

    function _MicrocodeHandlerStFirstC() {
        var MESFC;

        MESFC = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESFC.prototype = Object.create(AbstractMicrocode.prototype);
        MESFC.prototype.constructor = MESFC;

        MESFC.prototype.propagateNewRegisterData = function (registerBag, memoryRead, instruction, internalResultBag) {
            var dummyRegisterValue, regIn0, addressByteReg, addressByteNextRow;

            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            addressByteReg = registerBag.registerFile.out0(regIn0);
            dummyRegisterValue = registerBag.registerFile.out0(RegisterFile.DUMMY_REGISTER);

            addressByteNextRow = Alu.add(addressByteReg, CpuBitSize.MEMORY_COLUMN_IN_ROW);

            internalResultBag.registerSaveIndex = RegisterFile.DUMMY_REGISTER;
            internalResultBag.register = dummyRegisterValue;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getAddressRow(addressByteNextRow);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MESFC;
    }

    return _MicrocodeHandlerStFirstC();        // TODO change it to dependency injection

})();
