var RegisterFile = (function () {
    'use strict';

    _RegisterFile.$inject = [];

    function _RegisterFile() {
        var RF;

        RF = function () {
            this.register = new Uint32Array(RF.REGISTERS_SIZE);   // actually we need only 16bits
            this.$$initialize();
        };

        RF.REGISTERS_SIZE = 16;
        RF.PROGRAM_COUNTER = RF.REGISTERS_SIZE - 1;
        RF.DUMMY_REGISTER = 0;

        RF.prototype.$$initialize = function () {
            var i;

            for (i = 0; i < RF.REGISTERS_SIZE; i++) {
                this.register[i] = BitUtil.random(CpuBitSize.WORD);
            }
        };

        RF.prototype.reset = function () {
            var i;

            for (i = 0; i < RF.REGISTERS_SIZE; i++) {
                this.save(i, 0);
            }
        };

        RF.prototype.$$read = function (number) {
            return this.register[number];
        };

        RF.prototype.out0 = function (number) {
            return this.$$read(number);
        };

        RF.prototype.out1 = function (number) {
            return this.$$read(number);
        };

        RF.prototype.getProgramCounter = function () {
            return this.$$read(RF.PROGRAM_COUNTER);
        };

        RF.prototype.save = function (number, value) {
            this.register[number] = BitUtil.mask(value, CpuBitSize.WORD);
        };
        
        RF.prototype.serialize = function () {
            var i, out;

            out = '';
            for (i = 0; i < RF.REGISTERS_SIZE; i++) {
                out += this.register[i];
            }
            
            return out;
        };

        return RF;
    }

    return _RegisterFile();       // TODO change it to dependency injection

})();
