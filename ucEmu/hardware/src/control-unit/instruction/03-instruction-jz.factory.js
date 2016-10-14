var InstructionJz = (function () {
    'use strict';

    _InstructionJz.$inject = [];

    function _InstructionJz() {
        var IJ;

        IJ = function (opcode, microcodeJump, byteWidth, memoryRowAddressFromRegIn0, name, nameFull) {
            AbstractInstruction.apply(this, arguments);
        };

        IJ.prototype = Object.create(AbstractInstruction.prototype);
        IJ.prototype.constructor = IJ;

        return IJ;
    }

    return _InstructionJz();        // TODO change it to dependency injection

})();
