var Alu = (function () {
    'use strict';

    var Alu = function () {
        var
            self = this,
            cpu = null
        ;

        self.add = function (a, b) {
            return ((a & 0xFFFF) + (b & 0xFFFF)) & 0xFFFF;
        };

        self.sh = function (v, amountAbs, minusSign) {
            if (amountAbs >= 32) {
                return 0;
            }

            return (minusSign ? v >>> amountAbs : v << amountAbs) & 0xFFFF;        // TODO use asm-instruction ???
        };

        self.nand = function (a, b) {
            return (~(a & b)) & 0xFFFF;
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
