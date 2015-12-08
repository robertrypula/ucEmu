var Alu = (function () {
    'use strict';

    _Alu.$inject = [];

    function _Alu() {
        var A;

        A = function () {
        };

        A.prototype.add = function (a, b) {
            a = BitUtil.mask(a, BitUtil.BYTE_2);
            b = BitUtil.mask(b, BitUtil.BYTE_2);

            return BitUtil.mask(a + b, BitUtil.BYTE_2);
        };

        A.prototype.sh = function (v, amount) {
            var shifted, negative, amountAbsolute;

            v = BitUtil.mask(v, BitUtil.BYTE_2);
            amount = BitUtil.mask(amount, BitUtil.BYTE_2);

            negative = BitUtil.maskOneBit(amount, BitUtil.BYTE_2);
            amountAbsolute = negative
                ? BitUtil.invertSignU2(amount, BitUtil.BYTE_2)
                : amount
            ;
            shifted = negative
                ? BitUtil.shiftRight(v, amountAbsolute)
                : BitUtil.shiftLeft(v, amountAbsolute)
            ;

            return BitUtil.mask(shifted, BitUtil.BYTE_2);
        };

        A.prototype.nand = function (a, b) {
            return BitUtil.mask(~(a & b), BitUtil.BYTE_2);
        };

        return A;
    }

    return _Alu();        // TODO change it to dependency injection

})();
