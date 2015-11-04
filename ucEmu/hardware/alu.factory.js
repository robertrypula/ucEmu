var Alu = (function () {
    'use strict';

    _Alu.$inject = [];

    function _Alu() {
        var A;

        A = function () {
        };

        A.prototype.add = function (a, b) {
            a = BitUtils.mask(a, BitUtils.BYTE_2);
            b = BitUtils.mask(b, BitUtils.BYTE_2);

            return BitUtils.mask(a + b, BitUtils.BYTE_2);
        };

        A.prototype.sh = function (v, amount) {
            var shifted, negative, amountAbsolute;

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
            return BitUtils.mask(~(a & b), BitUtils.BYTE_2);
        };

        return A;
    }

    return _Alu();        // TODO change it do dependency injection

})();
