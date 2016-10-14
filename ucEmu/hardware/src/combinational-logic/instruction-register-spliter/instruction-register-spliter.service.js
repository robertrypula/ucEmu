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
            return BitUtil.shiftRight(
                regInstruction & 0x00FFFF00,
                BitUtil.BYTE_1
            );
        }

        return {
            getOpcode: getOpcode,
            getRegOut: getRegOut,
            getRegIn0: getRegIn0,
            getRegIn1: getRegIn1,
            getImm: getImm
        };
    }

    return new _InstructionRegisterSpliter();         // TODO change it to dependency injection
})();
