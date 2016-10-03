var Alu = (function () {
    'use strict';

    _Alu.$inject = [];

    function _Alu() {

        function add(a, b) {
            a = BitUtil.mask(a, BitSize.REGISTER);
            b = BitUtil.mask(b, BitSize.REGISTER);

            return BitUtil.mask(a + b, BitSize.REGISTER);
        }

        function sh(value, amount) {
            var shifted, negative, amountAbsolute;

            value = BitUtil.mask(value, BitSize.REGISTER);
            amount = BitUtil.mask(amount, BitSize.REGISTER);

            negative = BitUtil.maskOneBit(amount, BitSize.REGISTER);
            amountAbsolute = negative
                ? BitUtil.invertSignU2(amount, BitSize.REGISTER)
                : amount;
            shifted = negative
                ? BitUtil.shiftRight(value, amountAbsolute)
                : BitUtil.shiftLeft(value, amountAbsolute);

            return BitUtil.mask(shifted, BitSize.REGISTER);
        }

        function nand(a, b) {
            return BitUtil.mask(~(a & b), BitSize.REGISTER);
        }

        return {
            add: add,
            sh: sh,
            nand: nand
        };
    }

    return new _Alu();        // TODO change it to dependency injection

})();
