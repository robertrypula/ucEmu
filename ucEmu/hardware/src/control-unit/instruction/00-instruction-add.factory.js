var InstructionAdd = (function () {
    'use strict';

    _InstructionAdd.$inject = [];

    function _InstructionAdd() {
        var IA;

        IA = function (opcode, microcodeJump, byteWidth, addressByteFromReg, name, nameFull) {
            AbstractInstruction.apply(this, arguments);
        };

        IA.prototype = Object.create(AbstractInstruction.prototype);
        IA.prototype.constructor = IA;

        return IA;
    }

    return _InstructionAdd();        // TODO change it to dependency injection

})();
