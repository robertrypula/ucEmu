var MicrocodeHandlerLdSecond = (function () {
    'use strict';

    _MicrocodeHandlerLdSecond.$inject = [];

    function _MicrocodeHandlerLdSecond() {
        var MELS;

        MELS = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MELS.prototype = Object.create(AbstractMicrocode.prototype);
        MELS.prototype.constructor = MELS;

        MELS.prototype.propagateNewRegisterData = function (registerBag, memoryRead, instruction, internalResultBag) {
            var regIn0, addressByteReg, regOut, result, memoryReadPhaseTwo, addressByte;

            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            addressByteReg = registerBag.registerFile.out0(regIn0);

            memoryReadPhaseTwo = MemoryController.getMemoryReadPhaseTwo(addressByteReg, memoryRead, registerBag.regMemoryBuffer);
            result = MemoryController.getWordFromMemoryRead(memoryReadPhaseTwo);

            addressByte = RegisterFile.PROGRAM_COUNTER === regOut ? result : registerBag.registerFile.getProgramCounter();

            internalResultBag.registerSaveIndex = regOut;
            internalResultBag.register = result;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getAddressRow(addressByte);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MELS;
    }

    return _MicrocodeHandlerLdSecond();        // TODO change it to dependency injection

})();
