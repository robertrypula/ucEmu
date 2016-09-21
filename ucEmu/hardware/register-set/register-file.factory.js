var RegisterFile = (function () {
    'use strict';

    _RegisterFile.$inject = [];

    function _RegisterFile() {
        var RS;

        RS = function () {
            this.REGISTERS_SIZE = 16;
            this.PROGRAM_COUNTER_INDEX = this.REGISTERS_SIZE - 1;
            this.MEMORY_ACCESS_INDEX = this.REGISTERS_SIZE - 2;
            this.register = new Uint32Array(this.REGISTERS_SIZE);   // actually we need only 16bits

            this.$$initialize();
        };

        RS.prototype.$$initialize = function () {
            var i;

            for (i = 0; i < this.REGISTERS_SIZE; i++) {
                this.register[i] = BitUtil.random(BitUtil.BYTE_2);
            }
        };

        RS.prototype.reset = function () {
            var i;

            for (i = 0; i < this.REGISTERS_SIZE; i++) {
                this.save(i, 0);
            }
        };

        RS.prototype.getProgramCounter = function () {
            return this.read(this.PROGRAM_COUNTER_INDEX);
        };

        RS.prototype.getMemoryAccess = function () {
            return this.read(this.MEMORY_ACCESS_INDEX);
        };

        RS.prototype.setProgramCounter = function (value) {
            this.save(this.PROGRAM_COUNTER_INDEX, value);
        };

        RS.prototype.setMemoryAccess = function (value) {
            this.save(this.MEMORY_ACCESS_INDEX, value);
        };

        RS.prototype.read = function (number) {
            return this.register[number];
        };

        RS.prototype.save = function (number, value) {
            this.register[number] = BitUtil.mask(value, BitUtil.BYTE_2);
        };

        return RS;
    }

    return _RegisterFile();       // TODO change it to dependency injection

})();
