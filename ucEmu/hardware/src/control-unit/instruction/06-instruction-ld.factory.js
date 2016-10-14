var InstructionLd = (function () {
    'use strict';

    _InstructionLd.$inject = [];

    function _InstructionLd() {
        var ILD;

        ILD = function (opcode, microcodeJump, byteWidth, memoryRowAddressFromRegIn0, name, nameFull) {
            AbstractInstruction.apply(this, arguments);
        };

        ILD.prototype = Object.create(AbstractInstruction.prototype);
        ILD.prototype.constructor = ILD;

        return ILD;
    }

    return _InstructionLd();        // TODO change it to dependency injection

})();
