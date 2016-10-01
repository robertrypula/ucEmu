var InstructionJnz = (function () {
    'use strict';

    _InstructionJnz.$inject = [];

    function _InstructionJnz() {
        var IJ;

        IJ = function (opcode, microcodeJump, byteWidth, memoryRowAddressFromRegIn0, name, nameFull) {
            AbstractInstruction.apply(this, arguments);
        };

        IJ.prototype = Object.create(AbstractInstruction.prototype);
        IJ.prototype.constructor = IJ;

        return IJ;
    }

    return _InstructionJnz();        // TODO change it to dependency injection

})();
