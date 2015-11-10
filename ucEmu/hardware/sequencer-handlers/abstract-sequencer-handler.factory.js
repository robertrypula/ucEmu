var AbstractSequencerHandler = (function () {
    'use strict';

    _AbstractSequencerHandler.$inject = [];

    function _AbstractSequencerHandler() {
        var ASH;

        ASH = function () {
            CpuAware.apply(this, arguments);
        };

        ASH.prototype = Object.create(CpuAware.prototype);
        ASH.prototype.constructor = ASH;

        ASH.prototype.goToNextState = function () {
            this.$$checkCpu();
            this.$$goToNextState();               // polymorphic call TODO change name of method
        };

        ASH.prototype.updateOutput = function () {
            this.$$checkCpu();
            this.$$updateOutputMemoryRowAddress();
            this.$$updateOutputMemoryWrite();
            this.$$updateOutputMemoryWE();
        };

        ASH.prototype.$$goToNextState = function () {
            throw 'Abstract method called!';
        };

        ASH.prototype.$$updateOutputMemoryRowAddress = function () {
            this.$$cpu.outputs.memoryRowAddress = 0;                       // floating bus - pulled down by resistors
        };

        ASH.prototype.$$updateOutputMemoryWrite = function () {
            this.$$cpu.outputs.memoryWrite = 0;                            // floating bus - pulled down by resistors
        };

        ASH.prototype.$$updateOutputMemoryWE = function () {
            this.$$cpu.outputs.memoryWE = 0;                               // floating bus - pulled down by resistors
        };

        return ASH;
    }

    return _AbstractSequencerHandler();        // TODO change it do dependency injection

})();
