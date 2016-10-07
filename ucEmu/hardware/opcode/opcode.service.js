var Opcode = (function () {
    'use strict';

    _Opcode.$inject = [];

    function _Opcode() {
        return {
            ADD: 0,
            NAND: 1,
            SH: 2,
            JZ: 3,
            COPY: 4,
            IMM: 5,
            LD: 6,
            ST: 7,
            NOT_YET_DECODED: -1      // actually it's not 'real' instruction
        };
    }

    return new _Opcode();        // TODO change it to dependency injection

})();
