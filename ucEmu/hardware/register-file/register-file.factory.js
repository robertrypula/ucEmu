var RegisterFile = (function () {
    'use strict';

    _RegisterFile.$inject = [];

    function _RegisterFile() {
        var RS;

        RS = function () {
            this.register = new Uint32Array(RS.REGISTERS_SIZE);   // actually we need only 16bits
            this.$$initialize();
        };

        RS.REGISTERS_SIZE = 16;
        RS.PROGRAM_COUNTER = RS.REGISTERS_SIZE - 1;
        RS.MEMORY_ACCESS = RS.REGISTERS_SIZE - 2;

        RS.prototype.$$initialize = function () {
            var i;

            for (i = 0; i < RS.REGISTERS_SIZE; i++) {
                this.register[i] = BitUtil.random(BitSize.REGISTER);
            }
        };

        RS.prototype.reset = function () {
            var i;

            for (i = 0; i < RS.REGISTERS_SIZE; i++) {
                this.save(i, 0);
            }
        };

        RS.prototype.read = function (number) {
            return this.register[number];
        };

        RS.prototype.save = function (number, value) {
            this.register[number] = BitUtil.mask(value, BitSize.REGISTER);
        };

        return RS;
    }

    return _RegisterFile();       // TODO change it to dependency injection

})();
