var Microcode = (function () {
    'use strict';

    _Microcode.$inject = [];

    function _Microcode() {
        return {
            FETCH_FIRST: 0,
            FETCH_SECOND_AND_DECODE: 1,
            ADD: 2,
            NAND: 3,
            SH: 4,
            JNZ: 5,
            COPY: 6,
            IMM: 7,
            LD_FIRST: 8,
            LD_SECOND: 9,
            ST_FIRST_A: 10,
            ST_FIRST_B: 11,
            ST_FIRST_C: 12,
            ST_SECOND_A: 13,
            ST_SECOND_B: 14,
            ST_SECOND_C: 15
        };
    }

    return new _Microcode();        // TODO change it to dependency injection

})();
