var AbstractMicrocode = (function () {
    'use strict';

    _AbstractMicrocode.$inject = [];

    function _AbstractMicrocode() {
        var AM;

        AM = function (cpu) {
            CpuAware.apply(this, arguments);
            this.$$cpuShorthandReady = false;
        };

        AM.prototype = Object.create(CpuAware.prototype);
        AM.prototype.constructor = AM;

        AM.prototype.goToNextState = function () {
            //this.$$checkCpu();

            if (!this.$$cpuShorthandReady) {
                this.$$generateCpuShorthand();
            }

            this.$$goToNextState();               // polymorphic call TODO change name of method
        };

        AM.prototype.updateOutput = function () {
            //this.$$checkCpu();

            if (!this.$$cpuShorthandReady) {
                this.$$generateCpuShorthand();
            }

            this.$$updateOutputMemoryRowAddress();
            this.$$updateOutputMemoryWrite();
            this.$$updateOutputMemoryWE();
        };

        AM.prototype.$$goToNextState = function () {
            throw 'Abstract method called!';
        };

        AM.prototype.$$generateCpuShorthand = function () {
            this.$$OPCODE = InstructionDecoder.OPCODE;
            this.$$MICROCODE = ControlUnit.MICROCODE;

            this.$$insDec = this.$$cpu.core.instructionDecoder;
            this.$$regSet = this.$$cpu.core.registerSet;
            this.$$alu = this.$$cpu.core.alu;
            this.$$reg = this.$$cpu.register;
            this.$$out = this.$$cpu.outputs;
            this.$$in = this.$$cpu.inputs;

            this.$$cpuShorthandReady = true;
        };

        AM.prototype.$$updateOutputMemoryRowAddress = function () {
            this.$$out.memoryRowAddress = 0;                       // floating bus - pulled down by resistors
        };

        AM.prototype.$$updateOutputMemoryWrite = function () {
            this.$$out.memoryWrite = 0;                            // floating bus - pulled down by resistors
        };

        AM.prototype.$$updateOutputMemoryWE = function () {
            this.$$out.memoryWE = 0;                               // floating bus - pulled down by resistors
        };

        return AM;
    }

    return _AbstractMicrocode();        // TODO change it do dependency injection

})();
