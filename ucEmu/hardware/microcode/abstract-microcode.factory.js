 var AbstractMicrocode = (function () {
    'use strict';

    _AbstractMicrocode.$inject = [];

    function _AbstractMicrocode() {
        var AM;

        AM = function (cpu) {
            CpuAware.apply(this, arguments);
            this.$$cpuAliasesReady = false;
        };

        AM.prototype = Object.create(CpuAware.prototype);
        AM.prototype.constructor = AM;

        AM.prototype.goToNextState = function () {
            this.$$generateCpuAliases();
            this.$$goToNextState();               // polymorphic call TODO change name of method
        };

        AM.prototype.$$goToNextState = function () {
            throw 'Abstract method called!';
        };

        AM.prototype.$$generateCpuAliases = function () {
            if (this.$$cpuAliasesReady) {
                return;
            }
            
            this.$$MICROCODE = Microcode.MICROCODE;

            this.$$insDec = this.$$cpu.core.instructionDecoder;
            this.$$regFile = this.$$cpu.core.registerFile;
            this.$$alu = this.$$cpu.core.alu;
            this.$$mc = this.$$cpu.core.memoryController;

            this.$$core = this.$$cpu.core;
            this.$$out = this.$$cpu.output;
            this.$$in = this.$$cpu.input;

            this.$$cpuAliasesReady = true;
        };

        return AM;
    }

    return _AbstractMicrocode();        // TODO change it to dependency injection

})();
