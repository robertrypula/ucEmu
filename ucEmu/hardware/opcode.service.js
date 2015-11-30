var Opcode = (function () {
    'use strict';

    _Opcode.$inject = [];

    function _Opcode() {

        var OPCODE = {
            ADD: 0,
            NAND: 1,
            SH: 2,
            JNZ: 3,
            COPY: 4,
            IMM: 5,
            LD: 6,
            ST: 7
        };

        return {
            OPCODE: OPCODE
        };
    }

    return new _Opcode();        // TODO change it to dependency injection

})();
