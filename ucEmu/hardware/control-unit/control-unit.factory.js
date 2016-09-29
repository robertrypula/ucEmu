var ControlUnit = (function () {
    'use strict';

    _ControlUnit.$inject = [];

    function _ControlUnit() {
        var CU;

        CU = function (registerBag) {
            this.$$registerBag = registerBag;
            this.$$controlStore = [];
            this.$$initialize();
        };

        CU.prototype.$$initialize = function () {
            var self = this;

            Microcode.loop(function (key, microcode) {
                self.$$controlStore.push(
                    MicrocodeHandlerBuilder.build(microcode)
                );
            });
        };

        CU.prototype.$$getMicrocodeIndex = function (regSequencer) {
            var result = regSequencer;

            if (regSequencer < 0 || regSequencer >= this.$$controlStore.length) {
                result = Microcode.MICROCODE.FETCH_FIRST;   // fallback to first microcode entry
            }

            return result;
        };

        CU.prototype.$$getMicrocodeHandlerFromControlStore = function () {
            var microcodeIndex = this.$$getMicrocodeIndex(this.$$registerBag.regSequencer);

            return this.$$controlStore[microcodeIndex];
        };

        CU.prototype.clockHighToLow = function (memoryRead) {
            var microcodeHandler = this.$$getMicrocodeHandlerFromControlStore();

            microcodeHandler.finalizePropagationAndStoreResults(this.$$registerBag, memoryRead);
        };

        CU.prototype.isWriteEnableFlagActive = function () {
            var
                microcodeIndex = this.$$getMicrocodeIndex(this.$$registerBag.regSequencer),
                M = Microcode.MICROCODE;

            return microcodeIndex === M.ST_FIRST_B || microcodeIndex === M.ST_SECOND_B;
        };

        CU.prototype.getMemoryRowAddress = function () {
            return this.$$registerBag.regMemoryRowAddress;
        };

        CU.prototype.getMemoryWrite = function () {
            return this.$$registerBag.regMemoryWrite;
        };

        CU.prototype.getMemoryWE = function (clock) {
            return this.isWriteEnableFlagActive() && clock ? 1 : 0;
        };

        return CU;
    }

    return _ControlUnit();       // TODO change it to dependency injection

})();
