var InstructionNand = (function () {
    'use strict';

    _InstructionNand.$inject = [];

    function _InstructionNand() {
        var IN;

        IN = function (opcode, microcodeJump, byteWidth, memoryRowAddressFromRegIn0, name, nameFull) {
            AbstractInstruction.apply(this, arguments);
        };

        IN.prototype = Object.create(AbstractInstruction.prototype);
        IN.prototype.constructor = IN;

        return IN;
    }

    return _InstructionNand();        // TODO change it to dependency injection

})();
