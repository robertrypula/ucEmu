var MicrocodeHandlerAdd = (function () {
    'use strict';

     _MicrocodeHandlerAdd.$inject = [];

    function _MicrocodeHandlerAdd() {
        var MEA;

        MEA = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEA.prototype = Object.create(AbstractMicrocode.prototype);
        MEA.prototype.constructor = MEA;

        MEA.prototype.propagateNewRegisterData = function (registerBag, inputBag, instruction, internalResultBag) {
            var regOut, regIn0, regIn1, regIn0Value, regIn1Value, result, addressByte;

            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn1 = InstructionRegisterSpliter.getRegIn1(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.out0(regIn0);
            regIn1Value = registerBag.registerFile.out1(regIn1);
            result = Alu.add(regIn0Value, regIn1Value);

            addressByte = RegisterFile.PROGRAM_COUNTER === regOut ? result : registerBag.registerFile.getProgramCounter();
            
            internalResultBag.registerSaveIndex = regOut;
            internalResultBag.register = result;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getAddressRow(addressByte);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MEA;
    }

    return _MicrocodeHandlerAdd();        // TODO change it to dependency injection

})();
