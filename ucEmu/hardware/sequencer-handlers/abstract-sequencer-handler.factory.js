var AbstractMicrocode = (function () {
    'use strict';

    _AbstractMicrocode.$inject = [];

    function _AbstractMicrocode() {
        var ASH;

        ASH = function (cpu) {
            CpuAware.apply(this, arguments);
            this.$$cpuShorthandReady = false;
        };

        ASH.prototype = Object.create(CpuAware.prototype);
        ASH.prototype.constructor = ASH;

        ASH.prototype.goToNextState = function () {
            //this.$$checkCpu();

            if (!this.$$cpuShorthandReady) {
                this.$$generateCpuShorthand();
            }

            this.$$goToNextState();               // polymorphic call TODO change name of method
        };

        ASH.prototype.updateOutput = function () {
            //this.$$checkCpu();

            if (!this.$$cpuShorthandReady) {
                this.$$generateCpuShorthand();
            }

            this.$$updateOutputMemoryRowAddress();
            this.$$updateOutputMemoryWrite();
            this.$$updateOutputMemoryWE();
        };

        ASH.prototype.$$goToNextState = function () {
            throw 'Abstract method called!';
        };

        ASH.prototype.$$generateCpuShorthand = function () {
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

        ASH.prototype.$$updateOutputMemoryRowAddress = function () {
            this.$$out.memoryRowAddress = 0;                       // floating bus - pulled down by resistors
        };

        ASH.prototype.$$updateOutputMemoryWrite = function () {
            this.$$out.memoryWrite = 0;                            // floating bus - pulled down by resistors
        };

        ASH.prototype.$$updateOutputMemoryWE = function () {
            this.$$out.memoryWE = 0;                               // floating bus - pulled down by resistors
        };

        return ASH;
    }

    return _AbstractMicrocode();        // TODO change it do dependency injection

})();
