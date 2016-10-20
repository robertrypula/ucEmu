var Alu = (function () {
    'use strict';

    _Alu.$inject = [];

    function _Alu() {

        function add(a, b) {
            a = BitUtil.mask(a, CpuBitSize.WORD);
            b = BitUtil.mask(b, CpuBitSize.WORD);

            return BitUtil.mask(a + b, CpuBitSize.WORD);
        }

        function sh(value, amount) {
            var shifted, negative, amountAbsolute;

            value = BitUtil.mask(value, CpuBitSize.WORD);
            amount = BitUtil.mask(amount, CpuBitSize.WORD);

            negative = BitUtil.maskOneBit(amount, CpuBitSize.WORD);
            amountAbsolute = negative
                ? BitUtil.invertSignU2(amount, CpuBitSize.WORD)
                : amount;
            shifted = negative
                ? BitUtil.shiftRight(value, amountAbsolute)
                : BitUtil.shiftLeft(value, amountAbsolute);

            return BitUtil.mask(shifted, CpuBitSize.WORD);
        }

        function nand(a, b) {
            return BitUtil.mask(~(a & b), CpuBitSize.WORD);
        }

        return {
            add: add,
            sh: sh,
            nand: nand
        };
    }

    return new _Alu();        // TODO change it to dependency injection

})();
