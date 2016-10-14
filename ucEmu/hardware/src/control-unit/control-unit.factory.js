var ControlUnit = (function () {
    'use strict';

    _ControlUnit.$inject = [];

    function _ControlUnit() {
        var CU;

        CU = function () {
            this.$$controlStore = [];
            this.$$instructionSet = [];
            this.$$initialize();
        };

        CU.prototype.$$initialize = function () {
            var
                O = Opcode,
                M = Microcode;

            this.$$controlStore.push(
                MicrocodeHandlerBuilder.build(M.FETCH_FIRST, M.JUMP_IS_AT_INSTRUCTION, false, false, 'fetch first'),
                MicrocodeHandlerBuilder.build(M.FETCH_SECOND_AND_DECODE, M.JUMP_IS_AT_INSTRUCTION, false, false, 'fetch second and decode'),
                MicrocodeHandlerBuilder.build(M.ADD, M.FETCH_FIRST, false, false, 'add'),
                MicrocodeHandlerBuilder.build(M.NAND, M.FETCH_FIRST, false, false, 'nand'),
                MicrocodeHandlerBuilder.build(M.SH, M.FETCH_FIRST, false, false, 'sh'),
                MicrocodeHandlerBuilder.build(M.JZ, M.FETCH_FIRST, false, false, 'jz'),
                MicrocodeHandlerBuilder.build(M.COPY, M.FETCH_FIRST, false, false, 'copy'),
                MicrocodeHandlerBuilder.build(M.IMM, M.FETCH_FIRST, false, false, 'imm'),
                MicrocodeHandlerBuilder.build(M.LD_FIRST, M.LD_SECOND, false, false, 'ld first'),
                MicrocodeHandlerBuilder.build(M.LD_SECOND, M.FETCH_FIRST, false, false, 'ld second'),
                MicrocodeHandlerBuilder.build(M.ST_FIRST_A, M.ST_FIRST_B, false, false, 'st first a'),
                MicrocodeHandlerBuilder.build(M.ST_FIRST_B, M.ST_FIRST_C, true, false, 'st first b'),
                MicrocodeHandlerBuilder.build(M.ST_FIRST_C, M.ST_SECOND_A, false, true, 'st first c'),
                MicrocodeHandlerBuilder.build(M.ST_SECOND_A, M.ST_SECOND_B, false, false, 'st second a'),
                MicrocodeHandlerBuilder.build(M.ST_SECOND_B, M.ST_SECOND_C, true, false, 'st second b'),
                MicrocodeHandlerBuilder.build(M.ST_SECOND_C, M.FETCH_FIRST, false, true, 'st second c')
            );
            this.$$instructionSet.push(
                InstructionBuilder.build(O.ADD, M.ADD, 2, false, 'add', 'Addition'),
                InstructionBuilder.build(O.NAND, M.NAND, 2, false, 'nand', 'Bitwise NAND'),
                InstructionBuilder.build(O.SH, M.SH, 2, false, 'sh', 'Logical bit shift'),
                InstructionBuilder.build(O.JZ, M.JZ, 2, false, 'jz', 'Jump if zero'),
                InstructionBuilder.build(O.COPY, M.COPY, 2, false, 'copy', 'Copy'),
                InstructionBuilder.build(O.IMM, M.IMM, 3, false, 'imm', 'Immediate value'),
                InstructionBuilder.build(O.LD, M.LD_FIRST, 2, true, 'ld', 'Load'),
                InstructionBuilder.build(O.ST, M.ST_FIRST_A, 2, true, 'st', 'Store')
            );
            this.$$instructionNotYetDecoded = InstructionBuilder.build(
                O.NOT_YET_DECODED, M.FETCH_SECOND_AND_DECODE, 0, false, '???', 'Not yet decoded'
            );
        };

        CU.prototype.getMicrocodeHandler = function (regSequencer) {
            // remember to verify index ranges after changing control store
            return this.$$controlStore[regSequencer];
        };

        CU.prototype.getInstruction = function (regInstruction, microcodeHandler) {
            var instructionIndex, instruction;

            if (microcodeHandler.microcode === Microcode.FETCH_FIRST) {
                instruction = this.$$instructionNotYetDecoded;
            } else {
                // remember to verify index ranges after changing instruction set
                instructionIndex = InstructionRegisterSpliter.getOpcode(regInstruction);
                instruction = this.$$instructionSet[instructionIndex];
            }

            return instruction;
        };

        return CU;
    }

    return _ControlUnit();       // TODO change it to dependency injection

})();
