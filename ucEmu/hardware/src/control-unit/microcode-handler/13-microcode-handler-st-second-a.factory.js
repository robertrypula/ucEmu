var MicrocodeHandlerStSecondA = (function () {
    'use strict';

    _MicrocodeHandlerStSecondA.$inject = [];

    function _MicrocodeHandlerStSecondA() {
        var MESSA;

        MESSA = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESSA.prototype = Object.create(AbstractMicrocode.prototype);
        MESSA.prototype.constructor = MESSA;

        MESSA.prototype.propagateNewRegisterData = function (registerBag, memoryRead, instruction, internalResultBag) {
            var regIn0, regIn1, addressByteReg, dataToWrite, dummyRegisterValue, memoryWrite;

            dummyRegisterValue = registerBag.registerFile.out0(RegisterFile.DUMMY_REGISTER);

            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn1 = InstructionRegisterSpliter.getRegIn1(registerBag.regInstruction);
            addressByteReg = registerBag.registerFile.out0(regIn0);
            dataToWrite = registerBag.registerFile.out1(regIn1);
            memoryWrite = MemoryController.getMemoryWritePhaseTwo(addressByteReg, memoryRead, dataToWrite);

            internalResultBag.registerSaveIndex = RegisterFile.DUMMY_REGISTER;
            internalResultBag.register = dummyRegisterValue;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = registerBag.regMemoryRowAddress;
            internalResultBag.memoryWrite = memoryWrite;
        };

        return MESSA;
    }

    return _MicrocodeHandlerStSecondA();        // TODO change it to dependency injection

})();
