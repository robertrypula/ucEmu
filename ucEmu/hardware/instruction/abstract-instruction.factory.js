var AbstractInstruction = (function () {
    'use strict';

    _AbstractInstruction.$inject = [];

    function _AbstractInstruction() {
        var AI;
        
        AI = function (opcode, microcodeJump, byteWidth, memoryRowAddressFromRegIn0, name, nameFull) {
            this.$$opcode = opcode;
            this.$$microcodeJump = microcodeJump;
            this.$$byteWidth = byteWidth;
            this.$$memoryRowAddressFromRegIn0 = memoryRowAddressFromRegIn0;
            this.$$name = name;
            this.$$nameFull = nameFull;
        };

        return AI;
    }

    return _AbstractInstruction();        // TODO change it to dependency injection

})();
