var InstructionDecoder = (function () {
    'use strict';

    _InstructionDecoder.$inject = [];

    function _InstructionDecoder() {
        var ID;

        ID = function (cpu) {
            CpuAware.apply(this, arguments);

            this.$$instructionSet = [];
            this.$$byteWidthLookup;
            this.$$microcodeJumpLookup;
            
            this.$$initialize();
        };

        ID.prototype = Object.create(CpuAware.prototype);
        ID.prototype.constructor = ID;

        ID.prototype.$$initialize = function () {
            this.$$initializeInstructionSet();
            this.$$buildByteWidthLookup();
            this.$$buildMicrocodeJumpLookup();
        };

        ID.prototype.$$initializeInstructionSet = function () {
            var O, M;

            O = Opcode.OPCODE;
            M = Microcode.MICROCODE;

            this.$$instructionSet.push(
                { opcode: O.ADD, microcodeJump: M.EXECUTE_ADD, cycles: null, byteWidth: 2, name: 'add', nameFull: 'Addition' },
                { opcode: O.NAND, microcodeJump: M.EXECUTE_NAND, cycles: null, byteWidth: 2, name: 'nand', nameFull: 'Bitwise NAND' },
                { opcode: O.SH, microcodeJump: M.EXECUTE_SH, cycles: null, byteWidth: 2, name: 'sh',  nameFull: "Logical bit shift" },
                { opcode: O.JNZ, microcodeJump: M.EXECUTE_JNZ, cycles: null, byteWidth: 2, name: 'jnz', nameFull: "Jump if not zero" },
                { opcode: O.COPY, microcodeJump: M.EXECUTE_COPY, cycles: null, byteWidth: 2, name: 'copy', nameFull: "Copy" },
                { opcode: O.IMM, microcodeJump: M.EXECUTE_IMM, cycles: null, byteWidth: 4, name: 'imm', nameFull: "Immediate value" },
                { opcode: O.LD, microcodeJump: M.EXECUTE_LD_FIRST, cycles: null, byteWidth: 2, name: 'ld', nameFull: "Load" },
                { opcode: O.ST, microcodeJump: M.EXECUTE_ST_FIRST_A, cycles: null, byteWidth: 2, name: 'st', nameFull: "Store" }
            );
        };

        ID.prototype.$$buildByteWidthLookup = function () {
            this.$$byteWidthLookup = new Uint8Array(this.$$instructionSet.length);

            for (var i = 0; i < this.$$instructionSet.length; i++) {
                this.$$byteWidthLookup[i] = this.$$instructionSet[i].byteWidth;
            }
        };

        ID.prototype.$$buildMicrocodeJumpLookup = function () {
            this.$$microcodeJumpLookup = new Uint8Array(this.$$instructionSet.length);

            for (var i = 0; i < this.$$instructionSet.length; i++) {
                this.$$microcodeJumpLookup[i] = this.$$instructionSet[i].microcodeJump;
            }
        };

        ID.prototype.$$checkOpcode = function(opcode, method) {
            if (opcode < 0 || opcode >= this.$$instructionSet.length) {
                throw 'InstructionDecoder.' + method + '() - unknown opcode: ' + opcode;
            }
        };

        ID.prototype.getOpcode = function () {
            //this.$$checkCpu();

            return BitUtils.shiftRight(
                this.$$cpu.core.regInstruction & 0x70000000,
                BitUtils.BYTE_3 + BitUtils.BYTE_HALF
            );
        };

        ID.prototype.getRegOut = function () {
            //this.$$checkCpu();

            return BitUtils.shiftRight(
                this.$$cpu.core.regInstruction & 0x0F000000,
                BitUtils.BYTE_3
            );
        };

        ID.prototype.getRegIn0 = function () {
            //this.$$checkCpu();

            return BitUtils.shiftRight(
                this.$$cpu.core.regInstruction & 0x00F00000,
                BitUtils.BYTE_2 + BitUtils.BYTE_HALF
            );
        };

        ID.prototype.getRegIn1 = function () {
            //this.$$checkCpu();

            return BitUtils.shiftRight(
                this.$$cpu.core.regInstruction & 0x000F0000,
                BitUtils.BYTE_2
            );
        };

        ID.prototype.getImm = function () {
            //this.$$checkCpu();
            
            return this.$$cpu.core.regInstruction & 0x0000FFFF;
        };

        ID.prototype.getByteWidth = function (opcode) {
            return this.$$byteWidthLookup[opcode];
        };

        ID.prototype.getMicrocodeJump = function (opcode) {
            return this.$$microcodeJumpLookup[opcode];
        };

        ID.prototype.getInstruction = function (opcode) {
            //this.$$checkCpu();
            //this.$$checkOpcode(opcode, 'getInstruction');

            return this.$$instructionSet[opcode];
        };

        return ID;
    }

    return _InstructionDecoder();         // TODO change it to dependency injection
})();

