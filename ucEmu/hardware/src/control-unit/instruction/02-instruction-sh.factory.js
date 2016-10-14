var InstructionSh = (function () {
    'use strict';

    _InstructionSh.$inject = [];

    function _InstructionSh() {
        var IS;

        IS = function (opcode, microcodeJump, byteWidth, memoryRowAddressFromRegIn0, name, nameFull) {
            AbstractInstruction.apply(this, arguments);
        };

        IS.prototype = Object.create(AbstractInstruction.prototype);
        IS.prototype.constructor = IS;

        return IS;
    }

    return _InstructionSh();        // TODO change it to dependency injection

})();
