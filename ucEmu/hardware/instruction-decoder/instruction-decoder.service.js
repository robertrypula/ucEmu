var InstructionDecoder = (function () {
    'use strict';

    _InstructionDecoder.$inject = [];

    function _InstructionDecoder() {
        var
            $$instructionSet = [],
            $$byteWidthLookup = undefined,
            $$sequencerNextLookup = undefined;

        function $$initialize() {
            $$initializeInstructionSet();
            $$buildByteWidthLookup();
            $$buildSequencerNextLookup();
        }

        function $$initializeInstructionSet() {
            var O, M;

            O = Opcode.OPCODE;
            M = Microcode.MICROCODE;

            $$instructionSet.push(
                { opcode: O.ADD, sequencerNext: M.ADD, cycles: null, byteWidth: 2, name: 'add', nameFull: 'Addition' },
                { opcode: O.NAND, sequencerNext: M.NAND, cycles: null, byteWidth: 2, name: 'nand', nameFull: 'Bitwise NAND' },
                { opcode: O.SH, sequencerNext: M.SH, cycles: null, byteWidth: 2, name: 'sh',  nameFull: "Logical bit shift" },
                { opcode: O.JNZ, sequencerNext: M.JNZ, cycles: null, byteWidth: 2, name: 'jnz', nameFull: "Jump if not zero" },
                { opcode: O.COPY, sequencerNext: M.COPY, cycles: null, byteWidth: 2, name: 'copy', nameFull: "Copy" },
                { opcode: O.IMM, sequencerNext: M.IMM, cycles: null, byteWidth: 4, name: 'imm', nameFull: "Immediate value" },
                { opcode: O.LD, sequencerNext: M.LD_FIRST, cycles: null, byteWidth: 2, name: 'ld', nameFull: "Load" },
                { opcode: O.ST, sequencerNext: M.ST_FIRST_A, cycles: null, byteWidth: 2, name: 'st', nameFull: "Store" }
            );
        }

        function $$buildByteWidthLookup() {
            $$byteWidthLookup = new Uint8Array($$instructionSet.length);

            for (var i = 0; i < $$instructionSet.length; i++) {
                $$byteWidthLookup[i] = $$instructionSet[i].byteWidth;
            }
        }

        function $$buildSequencerNextLookup() {
            $$sequencerNextLookup = new Uint8Array($$instructionSet.length);

            for (var i = 0; i < $$instructionSet.length; i++) {
                $$sequencerNextLookup[i] = $$instructionSet[i].sequencerNext;
            }
        }

        function getOpcode(regInstruction) {
            return BitUtil.shiftRight(
                regInstruction & 0x70000000,
                BitUtil.BYTE_3 + BitUtil.BYTE_HALF
            );
        }

        function getRegOut(regInstruction) {
            return BitUtil.shiftRight(
                regInstruction & 0x0F000000,
                BitUtil.BYTE_3
            );
        }

        function getRegIn0(regInstruction) {
            return BitUtil.shiftRight(
                regInstruction & 0x00F00000,
                BitUtil.BYTE_2 + BitUtil.BYTE_HALF
            );
        }

        function getRegIn1(regInstruction) {
            return BitUtil.shiftRight(
                regInstruction & 0x000F0000,
                BitUtil.BYTE_2
            );
        }

        function getImm(regInstruction) {
            return regInstruction & 0x0000FFFF;
        }

        function getByteWidth(regInstruction) {
            var opcode = getOpcode(regInstruction);

            return $$byteWidthLookup[opcode];
        }

        function getSequencerNext(regInstruction) {
            var opcode = getOpcode(regInstruction);

            return $$sequencerNextLookup[opcode];
        }

        function getProgramCounterNext(regInstruction, regProgramCounter) {
            var byteWidth = getByteWidth(regInstruction);

            return BitUtil.mask(regProgramCounter + byteWidth, BitUtil.BYTE_2);
        }

        function isLoadOrStoreOpcode(regInstruction) {
            var
                opcode = getOpcode(regInstruction),
                O = Opcode.OPCODE;

            return opcode === O.LD || opcode === O.ST;
        }

        function getInstruction(regInstruction) {
            var
                opcode = getOpcode(regInstruction),
                instruction = $$instructionSet[opcode];

            return {
                opcode: instruction.opcode,
                sequencerNext: instruction.sequencerNext,
                cycles: instruction.cycles,
                byteWidth: instruction.byteWidth,
                name: instruction.name,
                nameFull: instruction.nameFull
            };
        }

        $$initialize();

        return {
            getOpcode: getOpcode,
            getRegOut: getRegOut,
            getRegIn0: getRegIn0,
            getRegIn1: getRegIn1,
            getImm: getImm,
            getByteWidth: getByteWidth,
            getSequencerNext: getSequencerNext,
            getProgramCounterNext: getProgramCounterNext,
            isLoadOrStoreOpcode: isLoadOrStoreOpcode,
            getInstruction: getInstruction
        };
    }

    return new _InstructionDecoder();         // TODO change it to dependency injection
})();
