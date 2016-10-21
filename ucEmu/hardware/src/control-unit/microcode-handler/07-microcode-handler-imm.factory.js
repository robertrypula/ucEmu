var MicrocodeHandlerImm = (function () {
    'use strict';

    _MicrocodeHandlerImm.$inject = [];

    function _MicrocodeHandlerImm() {
        var MEI;

        MEI = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEI.prototype = Object.create(AbstractMicrocode.prototype);
        MEI.prototype.constructor = MEI;

        MEI.prototype.propagateNewRegisterData = function (registerBag, memoryRead, instruction, internalResultBag) {
            var regOut, result, addressByte;

            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            result = InstructionRegisterSpliter.getImm(registerBag.regInstruction);
            
            addressByte = RegisterFile.PROGRAM_COUNTER === regOut ? result : registerBag.registerFile.getProgramCounter();

            internalResultBag.registerSaveIndex = regOut;
            internalResultBag.register = result;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getAddressRow(addressByte);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MEI;
    }

    return _MicrocodeHandlerImm();        // TODO change it to dependency injection

})();
