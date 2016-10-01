var InstructionSt = (function () {
    'use strict';

    _InstructionSt.$inject = [];

    function _InstructionSt() {
        var IST;

        IST = function (opcode, microcodeJump, byteWidth, memoryRowAddressFromRegIn0, name, nameFull) {
            AbstractInstruction.apply(this, arguments);
        };

        IST.prototype = Object.create(AbstractInstruction.prototype);
        IST.prototype.constructor = IST;

        return IST;
    }

    return _InstructionSt();        // TODO change it to dependency injection

})();
