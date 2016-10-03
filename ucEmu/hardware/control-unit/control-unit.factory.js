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
                MicrocodeHandlerBuilder.build(M.FETCH_FIRST, false, false, 'fetch first'),
                MicrocodeHandlerBuilder.build(M.FETCH_SECOND_AND_DECODE, false, false, 'fetch second and decode'),
                MicrocodeHandlerBuilder.build(M.ADD, false, false, 'add'),
                MicrocodeHandlerBuilder.build(M.NAND, false, false, 'nand'),
                MicrocodeHandlerBuilder.build(M.SH, false, false, 'sh'),
                MicrocodeHandlerBuilder.build(M.JNZ, false, false, 'jnz'),
                MicrocodeHandlerBuilder.build(M.COPY, false, false, 'copy'),
                MicrocodeHandlerBuilder.build(M.IMM, false, false, 'imm'),
                MicrocodeHandlerBuilder.build(M.LD_FIRST, false, false, 'ld first'),
                MicrocodeHandlerBuilder.build(M.LD_SECOND, false, false, 'ld second'),
                MicrocodeHandlerBuilder.build(M.ST_FIRST_A, false, false, 'st first a'),
                MicrocodeHandlerBuilder.build(M.ST_FIRST_B, true, false, 'st first b'),
                MicrocodeHandlerBuilder.build(M.ST_FIRST_C, false, true, 'st first c'),
                MicrocodeHandlerBuilder.build(M.ST_SECOND_A, false, false, 'st second a'),
                MicrocodeHandlerBuilder.build(M.ST_SECOND_B, true, false, 'st second b'),
                MicrocodeHandlerBuilder.build(M.ST_SECOND_C, false, true, 'st second c')
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

        CU.prototype.getMicrocodeHandler = function () {
            return this.$$controlStore[this.$$registerBag.regSequencer]; // remember to track index ranges after changing microcode
        };

        CU.prototype.getInstruction = function () {
            var instructionIndex = InstructionRegisterSpliter.getOpcode(this.$$registerBag.regInstruction);

            return this.$$instructionSet[instructionIndex];
        };

        CU.prototype.clockHighToLow = function (memoryRead) {
            var
                microcodeHandler = this.getMicrocodeHandler(),
                instruction = this.getInstruction();

            microcodeHandler.finalizePropagationAndStoreResults(this.$$registerBag, instruction, memoryRead);
        };

        CU.prototype.getWriteEnable = function (clock) {
            var microcodeHandler = this.getMicrocodeHandler();

            return MemoryController.getWriteEnable(
                clock,
                microcodeHandler.writeEnablePositive,
                microcodeHandler.writeEnableNegative
            );
        };

        return CU;
    }

    return _ControlUnit();       // TODO change it to dependency injection

})();
