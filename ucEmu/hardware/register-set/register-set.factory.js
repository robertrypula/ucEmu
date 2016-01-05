var RegisterSet = (function () {
    'use strict';

    _RegisterSet.$inject = [];

    function _RegisterSet() {
        var RS;

        RS = function () {
            this.REGISTERS_SIZE = 16;
            this.PROGRAM_COUNTER_INDEX = this.REGISTERS_SIZE - 1;
            this.MEMORY_ACCESS_INDEX = this.REGISTERS_SIZE - 2;
            this.register = new Uint32Array(this.REGISTERS_SIZE);   // accually we need only 16bits

            this.$$initialize();
        };

        RS.prototype.$$initialize = function () {
            for (var i = 0; i < this.REGISTERS_SIZE; i++) {
                this.register[i] = BitUtil.random(BitUtil.BYTE_2);
            }
        };

        RS.prototype.$$checkRange = function(number, method) {
            if (number < 0 || number >= this.REGISTERS_SIZE) {
                throw 'RegisterSet.' + method + '() - bad register number: ' + number;
            }
        };

        RS.prototype.reset = function () {
            for (var i = 0; i < this.REGISTERS_SIZE; i++) {
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
            //this.$$checkRange(number, 'read');

            return this.register[number];
        };

        RS.prototype.save = function (number, value) {
            //this.$$checkRange(number, 'save');
            this.register[number] = BitUtil.mask(value, BitUtil.BYTE_2);
        };

        return RS;
    }

    return _RegisterSet();       // TODO change it to dependency injection

})();