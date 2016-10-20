var AbstractInstruction = (function () {
    'use strict';

    _AbstractInstruction.$inject = [];

    function _AbstractInstruction() {
        var AI;
        
        AI = function (opcode, microcodeJump, byteWidth, addressByteFromReg, name, nameFull) {
            this.opcode = opcode;
            this.microcodeJump = microcodeJump;
            this.byteWidth = byteWidth;
            this.addressByteFromReg = addressByteFromReg;
            this.name = name;
            this.nameFull = nameFull;
        };

        return AI;
    }

    return _AbstractInstruction();        // TODO change it to dependency injection

})();
