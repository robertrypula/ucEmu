var Alu = (function () {
    'use strict';

    _Alu.$inject = [];

    function _Alu() {

        function add(a, b) {
            a = BitUtil.mask(a, BitUtil.BYTE_2);
            b = BitUtil.mask(b, BitUtil.BYTE_2);

            return BitUtil.mask(a + b, BitUtil.BYTE_2);
        }

        function sh(value, amount) {
            var shifted, negative, amountAbsolute;

            value = BitUtil.mask(value, BitUtil.BYTE_2);
            amount = BitUtil.mask(amount, BitUtil.BYTE_2);

            negative = BitUtil.maskOneBit(amount, BitUtil.BYTE_2);
            amountAbsolute = negative
                ? BitUtil.invertSignU2(amount, BitUtil.BYTE_2)
                : amount;
            shifted = negative
                ? BitUtil.shiftRight(value, amountAbsolute)
                : BitUtil.shiftLeft(value, amountAbsolute);

            return BitUtil.mask(shifted, BitUtil.BYTE_2);
        }

        function nand(a, b) {
            return BitUtil.mask(~(a & b), BitUtil.BYTE_2);
        }

        return {
            add: add,
            sh: sh,
            nand: nand
        };
    }

    return new _Alu();        // TODO change it to dependency injection

})();
