var MicrocodeHandlerStSecondB = (function () {
    'use strict';

    _MicrocodeHandlerStSecondB.$inject = [];

    function _MicrocodeHandlerStSecondB() {
        var MESSB;

        MESSB = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESSB.prototype = Object.create(AbstractMicrocode.prototype);
        MESSB.prototype.constructor = MESSB;

        MESSB.prototype.propagateNewRegisterData = function (registerBag, inputBag, instruction, internalResultBag) {
            var dummyRegisterValue;

            dummyRegisterValue = registerBag.registerFile.out0(RegisterFile.DUMMY_REGISTER);

            internalResultBag.registerSaveIndex = RegisterFile.DUMMY_REGISTER;
            internalResultBag.register = dummyRegisterValue;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = registerBag.regMemoryRowAddress;
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MESSB;
    }

    return _MicrocodeHandlerStSecondB();        // TODO change it to dependency injection

})();
