var InstructionImm = (function () {
    'use strict';

    _InstructionImm.$inject = [];

    function _InstructionImm() {
        var II;

        II = function (opcode, microcodeJump, byteWidth, addressByteFromReg, name, nameFull) {
            AbstractInstruction.apply(this, arguments);
        };

        II.prototype = Object.create(AbstractInstruction.prototype);
        II.prototype.constructor = II;

        return II;
    }

    return _InstructionImm();        // TODO change it to dependency injection

})();
