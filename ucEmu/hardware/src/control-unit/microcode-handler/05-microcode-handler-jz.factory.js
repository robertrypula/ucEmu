var MicrocodeHandlerJz = (function () {
    'use strict';

    _MicrocodeHandlerJz.$inject = [];

    function _MicrocodeHandlerJz() {
        var MEJ;

        MEJ = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEJ.prototype = Object.create(AbstractMicrocode.prototype);
        MEJ.prototype.constructor = MEJ;

        MEJ.prototype.propagateNewRegisterData = function (registerBag, inputBag, instruction, internalResultBag) {
            var regIn0, regIn1, addressByteReg, regIn1Value, zeroFlag, addressByte;

            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn1 = InstructionRegisterSpliter.getRegIn1(registerBag.regInstruction);
            addressByteReg = registerBag.registerFile.out0(regIn0);
            regIn1Value = registerBag.registerFile.out1(regIn1);
            zeroFlag = regIn1Value === 0;                              // TODO add isZero at ALU
            addressByte = zeroFlag ? addressByteReg : registerBag.registerFile.getProgramCounter();

            internalResultBag.registerSaveIndex = RegisterFile.PROGRAM_COUNTER;
            internalResultBag.register = addressByte;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getAddressRow(addressByte);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MEJ;
    }

    return _MicrocodeHandlerJz();        // TODO change it to dependency injection

})();
