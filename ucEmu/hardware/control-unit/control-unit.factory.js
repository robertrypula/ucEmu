var ControlUnit = (function () {
    'use strict';

    _ControlUnit.$inject = [];

    function _ControlUnit() {
        var CU;

        CU = function (cpu) {
            CpuAware.apply(this, arguments);
            this.$$controlStore = [];
            this.$$initialize();
        };

        CU.prototype = Object.create(CpuAware.prototype);
        CU.prototype.constructor = CU;

        CU.prototype.$$initialize = function () {
            var self = this;

            Microcode.loop(function (key, microcode) {
                self.$$controlStore.push(
                    MicrocodeHandlerBuilder.build(microcode, self.$$cpu)
                );
            });
        };

        CU.prototype.$$checkSequencer = function (sequencer) {
            var result = sequencer;

            if (sequencer < 0 || sequencer >= this.$$controlStore.length) {
                result = Microcode.MICROCODE.FETCH_FIRST;   // fallback to first microcode entry
            }

            return result;
        };

        CU.prototype.$$getMicrocodeFromControlStore = function () {
            var sequencer = this.$$checkSequencer(this.$$cpu.core.regSequencer);

            return this.$$controlStore[sequencer];
        };

        CU.prototype.finalizePropagationAndStoreResults = function () {
            this.$$getMicrocodeFromControlStore().finalizePropagationAndStoreResults();
        };

        CU.prototype.isWriteEnableFlagActive = function () {
            var
                M = Microcode.MICROCODE,
                sequencer = this.$$checkSequencer(this.$$cpu.core.regSequencer);

            return sequencer === M.ST_FIRST_B || sequencer === M.ST_SECOND_B;
        };

        CU.prototype.updateOutput = function () {
            var
                c = this.$$cpu.core,
                i = this.$$cpu.input,
                o = this.$$cpu.output;

            o.memoryRowAddress = c.regMemoryRowAddress;
            o.memoryWrite = c.regMemoryWrite;
            o.memoryWE = this.isWriteEnableFlagActive() && i.clock ? 1 : 0;
        };

        CU.prototype.postInitialize = function () {
            var i, microcode;

            for (i = 0; i < this.$$controlStore.length; i++) {
                microcode = this.$$controlStore[i];
                microcode.generateCpuAliases();
            }
        };

        return CU;
    }

    return _ControlUnit();       // TODO change it to dependency injection

})();
