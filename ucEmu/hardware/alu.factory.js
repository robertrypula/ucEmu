var Alu = (function () {
    'use strict';

    var Alu = function () {
        var
            self = this,
            cpu = null
        ;

        self.add = function (a, b) {
            checkCpu();
            a = BitUtils.mask(a, BitUtils.BYTE_2);
            b = BitUtils.mask(b, BitUtils.BYTE_2);

            return BitUtils.mask(a + b, BitUtils.BYTE_2);
        };

        self.sh = function (v, amountAbs, minusSign) {
            var shifted;

            checkCpu();
            v = BitUtils.mask(v, BitUtils.BYTE_2);
            shifted = minusSign 
                ? BitUtils.shiftRight(v, amountAbs) 
                : BitUtils.shiftLeft(v, amountAbs)
            ;

            return BitUtils.mask(shifted, BitUtils.BYTE_2);
        };

        self.nand = function (a, b) {
            checkCpu();

            return BitUtils.mask(~(a & b), BitUtils.BYTE_2);
        };

        self.setCpu = function (cpuSelf)
        {
            cpu = cpuSelf;
        };

        function checkCpu()
        {
            if (cpu === null) {
                throw 'Please attach cpu first';
            }
        }
    };

    return Alu;        // TODO change it do dependency injection

})();
