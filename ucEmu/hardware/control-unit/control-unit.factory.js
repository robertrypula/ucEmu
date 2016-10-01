var ControlUnit = (function () {
    'use strict';

    _ControlUnit.$inject = [];

    function _ControlUnit() {
        var CU;

        CU = function (registerBag) {
            this.$$registerBag = registerBag;
            this.$$controlStore = [];
            this.$$instructionSet = [];
            this.$$initialize();
        };

        CU.prototype.$$initialize = function () {
            var
                O = Opcode,
                M = Microcode;

            this.$$controlStore.push(
                MicrocodeHandlerBuilder.build(M.FETCH_FIRST),
                MicrocodeHandlerBuilder.build(M.FETCH_SECOND_AND_DECODE),
                MicrocodeHandlerBuilder.build(M.ADD),
                MicrocodeHandlerBuilder.build(M.NAND),
                MicrocodeHandlerBuilder.build(M.SH),
                MicrocodeHandlerBuilder.build(M.JNZ),
                MicrocodeHandlerBuilder.build(M.COPY),
                MicrocodeHandlerBuilder.build(M.IMM),
                MicrocodeHandlerBuilder.build(M.LD_FIRST),
                MicrocodeHandlerBuilder.build(M.LD_SECOND),
                MicrocodeHandlerBuilder.build(M.ST_FIRST_A),
                MicrocodeHandlerBuilder.build(M.ST_FIRST_B),
                MicrocodeHandlerBuilder.build(M.ST_FIRST_C),
                MicrocodeHandlerBuilder.build(M.ST_SECOND_A),
                MicrocodeHandlerBuilder.build(M.ST_SECOND_B),
                MicrocodeHandlerBuilder.build(M.ST_SECOND_C)
            );
            this.$$instructionSet.push(
                InstructionBuilder.build(O.ADD, M.ADD, 2, false, 'add', 'Addition'),
                InstructionBuilder.build(O.NAND, M.NAND, 2, false, 'nand', 'Bitwise NAND'),
                InstructionBuilder.build(O.SH, M.SH, 2, false, 'sh', 'Logical bit shift'),
                InstructionBuilder.build(O.JNZ, M.JNZ, 2, false, 'jnz', 'Jump if not zero'),
                InstructionBuilder.build(O.COPY, M.COPY, 2, false, 'copy', 'Copy'),
                InstructionBuilder.build(O.IMM, M.IMM, 4, false, 'imm', 'Immediate value'),
                InstructionBuilder.build(O.LD, M.LD_FIRST, 2, true, 'ld', 'Load'),
                InstructionBuilder.build(O.ST, M.ST_FIRST_A, 2, true, 'st', 'Store')
            );
        };

        CU.prototype.$$getMicrocodeIndex = function (regSequencer) {
            var result = regSequencer;

            if (regSequencer < 0 || regSequencer >= this.$$controlStore.length) {
                result = Microcode.FETCH_FIRST;   // fallback to first microcode
            }

            return result;
        };

        CU.prototype.$$getMicrocodeHandler = function () {
            var microcodeIndex = this.$$getMicrocodeIndex(this.$$registerBag.regSequencer);

            return this.$$controlStore[microcodeIndex];
        };

        CU.prototype.clockHighToLow = function (memoryRead) {
            var microcodeHandler = this.$$getMicrocodeHandler();

            microcodeHandler.finalizePropagationAndStoreResults(this.$$registerBag, memoryRead);
        };

        CU.prototype.isWriteEnableFlagActive = function () {
            var
                microcodeIndex = this.$$getMicrocodeIndex(this.$$registerBag.regSequencer),
                M = Microcode;

            return microcodeIndex === M.ST_FIRST_B || microcodeIndex === M.ST_SECOND_B;
        };

        return CU;
    }

    return _ControlUnit();       // TODO change it to dependency injection

})();
