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
            this.$$controlStore.push(
                MicrocodeHandlerBuilder.build(Microcode.FETCH_FIRST),
                MicrocodeHandlerBuilder.build(Microcode.FETCH_SECOND_AND_DECODE),
                MicrocodeHandlerBuilder.build(Microcode.ADD),
                MicrocodeHandlerBuilder.build(Microcode.NAND),
                MicrocodeHandlerBuilder.build(Microcode.SH),
                MicrocodeHandlerBuilder.build(Microcode.JNZ),
                MicrocodeHandlerBuilder.build(Microcode.COPY),
                MicrocodeHandlerBuilder.build(Microcode.IMM),
                MicrocodeHandlerBuilder.build(Microcode.LD_FIRST),
                MicrocodeHandlerBuilder.build(Microcode.LD_SECOND),
                MicrocodeHandlerBuilder.build(Microcode.ST_FIRST_A),
                MicrocodeHandlerBuilder.build(Microcode.ST_FIRST_B),
                MicrocodeHandlerBuilder.build(Microcode.ST_FIRST_C),
                MicrocodeHandlerBuilder.build(Microcode.ST_SECOND_A),
                MicrocodeHandlerBuilder.build(Microcode.ST_SECOND_B),
                MicrocodeHandlerBuilder.build(Microcode.ST_SECOND_C)
            );
        };

        CU.prototype.$$getMicrocodeIndex = function (regSequencer) {
            var result = regSequencer;

            if (regSequencer < 0 || regSequencer >= this.$$controlStore.length) {
                result = Microcode.FETCH_FIRST;   // fallback to first microcode
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
                M = Microcode;

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
