var MicrocodeHandlerCopy = (function () {
    'use strict';

    _MicrocodeHandlerCopy.$inject = [];

    function _MicrocodeHandlerCopy() {
        var MEC;

        MEC = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEC.prototype = Object.create(AbstractMicrocode.prototype);
        MEC.prototype.constructor = MEC;

        MEC.prototype.propagateNewRegisterData = function (registerBag, inputBag, instruction, internalResultBag) {
            var regOut, regIn0, regResult, address;

            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regResult = registerBag.registerFile.out0(regIn0);

            // TODO when instruction will save to PC it will produce wrong result - fixed?
            address = RegisterFile.PROGRAM_COUNTER === regOut ? regResult : registerBag.registerFile.getProgramCounter();

            internalResultBag.registerSaveIndex = regOut;
            internalResultBag.register = regResult;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getMemoryRowAddress(address);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MEC;
    }

    return _MicrocodeHandlerCopy();        // TODO change it to dependency injection

})();
