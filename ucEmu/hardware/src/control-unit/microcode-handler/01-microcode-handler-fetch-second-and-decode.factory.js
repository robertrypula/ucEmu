var MicrocodeHandlerFetchSecondAndDecode = (function () {
    'use strict';

    /*
     RAM content:
     0x00 0x00 0xaa 0xbb
     0xcc 0xdd 0x00 0x00

     Fetch first
     0xaa 0xbb ____ ____     << aCol with zero fill

     Fetch second
     ____ ____ 0xcc 0xdd     >> 4-aCol width zero fill
    */

    _MicrocodeHandlerFetchSecondAndDecode.$inject = [];

    function _MicrocodeHandlerFetchSecondAndDecode() {
        var MFSAD;

        MFSAD = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MFSAD.prototype = Object.create(AbstractMicrocode.prototype);
        MFSAD.prototype.constructor = MFSAD;

        MFSAD.prototype.propagateNewRegisterData = function (registerBag, memoryRead, instruction, internalResultBag) {
            var memoryReadFinal,
                addressByte,
                register, regMemoryRowAddressNext,
                regIn0, regIn0Value,
                addressRowAsWord, addressRow;

            addressByte = registerBag.registerFile.getProgramCounter();
            register = Alu.add(addressByte, instruction.byteWidth);
            memoryReadFinal = MemoryController.getMemoryReadShiftedPhaseTwo(addressByte, memoryRead, registerBag.regMemoryBuffer);

            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.out0(regIn0);
            regMemoryRowAddressNext = instruction.memoryRowAddressFromRegIn0 ? regIn0Value : register;

            addressRowAsWord = MemoryController.getAddressRowAsWord(regMemoryRowAddressNext);
            addressRow = MemoryController.getAddressRowFromAddressRowAsWord(addressRowAsWord);

            internalResultBag.registerSaveIndex = RegisterFile.PROGRAM_COUNTER;
            internalResultBag.register = register;
            internalResultBag.instruction = memoryReadFinal;
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = addressRow;
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MFSAD;
    }

    return _MicrocodeHandlerFetchSecondAndDecode();        // TODO change it to dependency injection

})();
