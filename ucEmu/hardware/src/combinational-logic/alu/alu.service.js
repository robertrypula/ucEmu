var Alu = (function () {
    'use strict';

    _Alu.$inject = [];

    function _Alu() {

        function add(a, b) {
            a = BitUtil.mask(a, CpuBitSize.REGISTER);
            b = BitUtil.mask(b, CpuBitSize.REGISTER);

            return BitUtil.mask(a + b, CpuBitSize.REGISTER);
        }

        function sh(value, amount) {
            var shifted, negative, amountAbsolute;

            value = BitUtil.mask(value, CpuBitSize.REGISTER);
            amount = BitUtil.mask(amount, CpuBitSize.REGISTER);

            negative = BitUtil.maskOneBit(amount, CpuBitSize.REGISTER);
            amountAbsolute = negative
                ? BitUtil.invertSignU2(amount, CpuBitSize.REGISTER)
                : amount;
            shifted = negative
                ? BitUtil.shiftRight(value, amountAbsolute)
                : BitUtil.shiftLeft(value, amountAbsolute);

            return BitUtil.mask(shifted, CpuBitSize.REGISTER);
        }

        function nand(a, b) {
            return BitUtil.mask(~(a & b), CpuBitSize.REGISTER);
        }

        return {
            add: add,
            sh: sh,
            nand: nand
        };
    }

    return new _Alu();        // TODO change it to dependency injection

})();
