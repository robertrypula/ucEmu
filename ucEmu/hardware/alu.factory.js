var Alu = (function () {
    'use strict';

    var Alu = function () {
        var
            self = this,
            cpu = null
        ;

        self.add = function (a, b) {
            checkCpu();
            a = BitUtils.mask(a, 16);
            b = BitUtils.mask(b, 16);

            return BitUtils.mask(a + b, 16);
        };

        self.sh = function (v, amountAbs, minusSign) {
            var shifted;

            checkCpu();
            v = BitUtils.mask(v, 16);
            shifted = minusSign 
                ? BitUtils.shiftRight(v, amountAbs) 
                : BitUtils.shiftLeft(v, amountAbs)
            ;

            return BitUtils.mask(shifted, 16);
        };

        self.nand = function (a, b) {
            checkCpu();

            return BitUtils.mask(~(a & b), 16);
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
