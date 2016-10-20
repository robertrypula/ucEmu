var MicrocodeHandlerSh = (function () {
    'use strict';

    _MicrocodeHandlerSh.$inject = [];

    function _MicrocodeHandlerSh() {
        var MES;

        MES = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MES.prototype = Object.create(AbstractMicrocode.prototype);
        MES.prototype.constructor = MES;

        MES.prototype.propagateNewRegisterData = function (registerBag, inputBag, instruction, internalResultBag) {
            var regOut, regIn0, regIn1,
                regIn0Value, regIn1Value, regResult, address;

            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn1 = InstructionRegisterSpliter.getRegIn1(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.out0(regIn0);
            regIn1Value = registerBag.registerFile.out1(regIn1);
            regResult = Alu.sh(regIn0Value, regIn1Value);

            // TODO when instruction will save to PC it will produce wrong result - fixed?
            address = RegisterFile.PROGRAM_COUNTER === regOut ? regResult : registerBag.registerFile.getProgramCounter();

            internalResultBag.registerSaveIndex = regOut;
            internalResultBag.register = regResult;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getMemoryRowAddress(address);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MES;
    }

    return _MicrocodeHandlerSh();        // TODO change it to dependency injection

})();
