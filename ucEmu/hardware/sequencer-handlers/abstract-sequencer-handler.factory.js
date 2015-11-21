var AbstractSequencerHandler = (function () {
    'use strict';

    _AbstractSequencerHandler.$inject = [];

    function _AbstractSequencerHandler() {
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
            this.$$insDec = this.$$cpu.core.instructionDecoder;
            this.$$insDecOPCODE = this.$$cpu.core.instructionDecoder.OPCODE;
            this.$$regSet = this.$$cpu.core.registerSet;
            this.$$alu = this.$$cpu.core.alu;
            this.$$reg = this.$$cpu.register;
            this.$$out = this.$$cpu.outputs;
            this.$$in = this.$$cpu.inputs;
            this.$$seqSTATE = this.$$cpu.core.sequencer.STATE;

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

    return _AbstractSequencerHandler();        // TODO change it do dependency injection

})();
