 var AbstractMicrocode = (function () {
    'use strict';

    _AbstractMicrocode.$inject = [];

    function _AbstractMicrocode() {
        var AM;

        AM = function (cpu) {
            CpuAware.apply(this, arguments);
        };

        AM.prototype = Object.create(CpuAware.prototype);
        AM.prototype.constructor = AM;

        AM.prototype.generateCpuAliases = function () {
            this.$$MICROCODE = Microcode.MICROCODE;
            
            this.$$regFile = this.$$cpu.core.registerFile;
            this.$$alu = this.$$cpu.core.alu;

            this.$$core = this.$$cpu.core;
            this.$$in = this.$$cpu.input;
        };

        return AM;
    }

    return _AbstractMicrocode();        // TODO change it to dependency injection

})();
