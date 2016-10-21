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
            var memoryReadPhaseTwo, addressBytePC, addressBytePCNext, addressByte, regIn0, addressByteReg;

            addressBytePC = registerBag.registerFile.getProgramCounter();
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            addressByteReg = registerBag.registerFile.out0(regIn0);
            memoryReadPhaseTwo = MemoryController.getMemoryReadPhaseTwo(addressBytePC, memoryRead, registerBag.regMemoryBuffer);

            addressBytePCNext = Alu.add(addressBytePC, instruction.byteWidth);
            addressByte = instruction.addressByteFromReg ? addressByteReg : addressBytePCNext;

            internalResultBag.registerSaveIndex = RegisterFile.PROGRAM_COUNTER;
            internalResultBag.register = addressBytePCNext;
            internalResultBag.instruction = memoryReadPhaseTwo;
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getAddressRow(addressByte);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MFSAD;
    }

    return _MicrocodeHandlerFetchSecondAndDecode();        // TODO change it to dependency injection

})();
