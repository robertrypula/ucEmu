var MicrocodeHandlerStSecondC = (function () {
    'use strict';

    _MicrocodeHandlerStSecondC.$inject = [];

    function _MicrocodeHandlerStSecondC() {
        var MESSC;

        MESSC = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESSC.prototype = Object.create(AbstractMicrocode.prototype);
        MESSC.prototype.constructor = MESSC;

        MESSC.prototype.propagateNewRegisterData = function (registerBag, memoryRead, instruction, internalResultBag) {
            var dummyRegisterValue, addressByte;

            addressByte = registerBag.registerFile.getProgramCounter();
            dummyRegisterValue = registerBag.registerFile.out0(RegisterFile.DUMMY_REGISTER);

            internalResultBag.registerSaveIndex = RegisterFile.DUMMY_REGISTER;
            internalResultBag.register = dummyRegisterValue;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getAddressRow(addressByte);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MESSC;
    }

    return _MicrocodeHandlerStSecondC();        // TODO change it to dependency injection

})();
