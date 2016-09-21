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
            //this.$$checkCpu();

            if (!this.$$cpuAliasesReady) {
                this.$$generateCpuAliases();
            }

            this.$$goToNextState();               // polymorphic call TODO change name of method
        };

        AM.prototype.updateOutput = function () {
            //this.$$checkCpu();

            if (!this.$$cpuAliasesReady) {
                this.$$generateCpuAliases();
            }

            this.$$updateOutputMemoryRowAddress();
            this.$$updateOutputMemoryWrite();
            this.$$updateOutputMemoryWE();
        };

        AM.prototype.$$goToNextState = function () {
            throw 'Abstract method called!';
        };

        AM.prototype.$$generateCpuAliases = function () {
            this.$$MICROCODE = Microcode.MICROCODE;

            this.$$insDec = this.$$cpu.core.instructionDecoder;
            this.$$regSet = this.$$cpu.core.registerSet;
            this.$$alu = this.$$cpu.core.alu;
            this.$$mc = this.$$cpu.core.memoryController;
            this.$$core = this.$$cpu.core;
            this.$$out = this.$$cpu.output;
            this.$$in = this.$$cpu.input;

            this.$$cpuAliasesReady = true;
        };

        AM.prototype.$$updateOutputMemoryRowAddress = function () {
            this.$$out.memoryRowAddress = this.$$mc.getMemoryRowAddress(this.$$regSet.getProgramCounter());
        };

        AM.prototype.$$updateOutputMemoryWrite = function () {
            this.$$out.memoryWrite = 0;                            // floating bus - pulled down by resistors
        };

        AM.prototype.$$updateOutputMemoryWE = function () {
            this.$$out.memoryWE = 0;                               // floating bus - pulled down by resistors
        };

        return AM;
    }

    return _AbstractMicrocode();        // TODO change it to dependency injection

})();
