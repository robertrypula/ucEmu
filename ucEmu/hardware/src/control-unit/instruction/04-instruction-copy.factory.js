var InstructionCopy = (function () {
    'use strict';

    _InstructionCopy.$inject = [];

    function _InstructionCopy() {
        var IC;

        IC = function (opcode, microcodeJump, byteWidth, addressByteFromReg, name, nameFull) {
            AbstractInstruction.apply(this, arguments);
        };

        IC.prototype = Object.create(AbstractInstruction.prototype);
        IC.prototype.constructor = IC;

        return IC;
    }

    return _InstructionCopy();        // TODO change it to dependency injection

})();
