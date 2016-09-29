 var AbstractMicrocode = (function () {
    'use strict';

    _AbstractMicrocode.$inject = [];

    function _AbstractMicrocode() {
        var AM;

        AM = function (cpu) {
            this.$$cpu = cpu;
        };

        AM.prototype.generateCpuAliases = function () {
            this.$$MICROCODE = Microcode.MICROCODE;
            
            this.$$regFile = this.$$cpu.core.registerFile;
            this.$$core = this.$$cpu.core;
            this.$$in = this.$$cpu.input;
        };

        return AM;
    }

    return _AbstractMicrocode();        // TODO change it to dependency injection

})();
