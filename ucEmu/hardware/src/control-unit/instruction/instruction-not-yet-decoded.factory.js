var InstructionNotYetDecoded = (function () {
    'use strict';

    _InstructionNotYetDecoded.$inject = [];

    function _InstructionNotYetDecoded() {
        var INYD;

        INYD = function (opcode, microcodeJump, byteWidth, memoryRowAddressFromRegIn0, name, nameFull) {
            AbstractInstruction.apply(this, arguments);
        };

        INYD.prototype = Object.create(AbstractInstruction.prototype);
        INYD.prototype.constructor = INYD;

        return INYD;
    }

    return _InstructionNotYetDecoded();        // TODO change it to dependency injection

})();
