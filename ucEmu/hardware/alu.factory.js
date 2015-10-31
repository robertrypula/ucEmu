var Alu = (function () {
    'use strict';

    _Alu.$inject = [];

    function _Alu() {
        var A;

        A = function () {
            this.$$cpu = null;
        };

        A.prototype.add = function (a, b) {
            this.$$checkCpu();
            a = BitUtils.mask(a, BitUtils.BYTE_2);
            b = BitUtils.mask(b, BitUtils.BYTE_2);

            return BitUtils.mask(a + b, BitUtils.BYTE_2);
        };

        A.prototype.sh = function (v, amount) {
            var shifted, negative, amountAbsolute;

            this.$$checkCpu();

            v = BitUtils.mask(v, BitUtils.BYTE_2);
            amount = BitUtils.mask(amount, BitUtils.BYTE_2);

            negative = BitUtils.maskOneBit(amount, BitUtils.BYTE_2);
            amountAbsolute = negative
                ? BitUtils.invertSignU2(amount, BitUtils.BYTE_2)
                : amount
            ;
            shifted = negative
                ? BitUtils.shiftRight(v, amountAbsolute)
                : BitUtils.shiftLeft(v, amountAbsolute)
            ;

            return BitUtils.mask(shifted, BitUtils.BYTE_2);
        };

        A.prototype.nand = function (a, b) {
            this.$$checkCpu();

            return BitUtils.mask(~(a & b), BitUtils.BYTE_2);
        };

        A.prototype.setCpu = function (cpu) {
            this.$$cpu = cpu;
        };

        A.prototype.$$checkCpu = function () {
            if (this.$$cpu === null) {
                throw 'Please attach cpu first';
            }
        };

        return A;
    }

    return _Alu();        // TODO change it do dependency injection

})();
