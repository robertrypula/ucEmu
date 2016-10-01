var InstructionRegisterSpliter = (function () {
    'use strict';

    _InstructionRegisterSpliter.$inject = [];

    function _InstructionRegisterSpliter() {
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

        /*
        function getByteWidth(regInstruction) {
            var opcode = getOpcode(regInstruction);

            return this.$$instructionSet[opcode].byteWidth;
            // return $$byteWidthLookup[opcode];
        }

        function getSequencerNext(regInstruction) {
            var opcode = getOpcode(regInstruction);

            return this.$$instructionSet[opcode].sequencerNext;
            // return $$sequencerNextLookup[opcode];
        }

        function getProgramCounterNext(regInstruction, regProgramCounter) {
            var byteWidth = getByteWidth(regInstruction);

            return BitUtil.mask(regProgramCounter + byteWidth, BitUtil.BYTE_2);
        }

        function isLoadOrStoreOpcode(regInstruction) {
            var
                opcode = getOpcode(regInstruction),
                O = Opcode;

            return opcode === O.LD || opcode === O.ST;
        }
        */

        return {
            getOpcode: getOpcode,
            getRegOut: getRegOut,
            getRegIn0: getRegIn0,
            getRegIn1: getRegIn1,
            getImm: getImm
            // getByteWidth: getByteWidth,
            // getSequencerNext: getSequencerNext,
            // getProgramCounterNext: getProgramCounterNext,
            // isLoadOrStoreOpcode: isLoadOrStoreOpcode
        };
    }

    return new _InstructionRegisterSpliter();         // TODO change it to dependency injection
})();
