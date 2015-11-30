var Microcode = (function () {
    'use strict';

    _Microcode.$inject = [];

    function _Microcode() {

        var MICROCODE = {
            FETCH_FIRST: 0,
            FETCH_SECOND_AND_DECODE: 1,
            EXECUTE_ADD: 2,
            EXECUTE_NAND: 3,
            EXECUTE_SH: 4,
            EXECUTE_JNZ: 5,
            EXECUTE_COPY: 6,
            EXECUTE_IMM: 7,
            EXECUTE_LD_FIRST: 8,
            EXECUTE_LD_SECOND: 9,
            EXECUTE_ST_FIRST_A: 10,
            EXECUTE_ST_FIRST_B: 11,
            EXECUTE_ST_FIRST_C: 12,
            EXECUTE_ST_SECOND_A: 13,
            EXECUTE_ST_SECOND_B: 14,
            EXECUTE_ST_SECOND_C: 15
        };

        function loop(callback) {
            var key;

            for (key in MICROCODE) {
                callback(key, MICROCODE[key]);
            }
        };

        return {
            MICROCODE: MICROCODE,
            loop: loop
        };
    }

    return new _Microcode();        // TODO change it to dependency injection

})();
