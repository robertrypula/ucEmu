var Opcode = (function () {
    'use strict';

    _Opcode.$inject = [];

    function _Opcode() {
        var $$OPCODE,
            $$keyLookUp;

        $$OPCODE = {
            ADD: 0,
            NAND: 1,
            SH: 2,
            JNZ: 3,
            COPY: 4,
            IMM: 5,
            LD: 6,
            ST: 7
        };

        function loop(callback) {
            var key;

            for (key in $$OPCODE) {
                callback(key, $$OPCODE[key]);
            }
        }

        function getOpcodeKey(number) {
            return $$keyLookUp[number];
        }

        function $$initializeKeyLookUp() {
            $$keyLookUp = [];

            loop(function (key) {
                $$keyLookUp.push(key);
            });
        }

        function $$init() {
            $$initializeKeyLookUp();
        }

        $$init();

        return {
            OPCODE: $$OPCODE,
            getOpcodeKey: getOpcodeKey
        };
    }

    return new _Opcode();        // TODO change it to dependency injection

})();
