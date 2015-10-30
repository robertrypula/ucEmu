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

        A.prototype.sh = function (v, amountAbs, minusSign) {
            var shifted;

            this.$$checkCpu();
            v = BitUtils.mask(v, BitUtils.BYTE_2);
            shifted = minusSign 
                ? BitUtils.shiftRight(v, amountAbs) 
                : BitUtils.shiftLeft(v, amountAbs)
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
