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

        ID.OPCODE = {
            ADD: 0,
            NAND: 1,
            SH: 2,
            JNZ: 3,
            COPY: 4,
            IMM: 5,
            LD: 6,
            ST: 7
        };

        ID.prototype = Object.create(CpuAware.prototype);
        ID.prototype.constructor = ID;

        ID.prototype.$$initialize = function () {
            this.$$initializeInstructionSet();
            this.$$buildByteWidthLookup();
            this.$$buildMicrocodeJumpLookup();
        };

        ID.prototype.$$initializeInstructionSet = function () {
            var MC = Sequencer.MICROCODE;

            this.$$instructionSet.push(
                { opCode: ID.OPCODE.ADD, microcodeJump: MC.EXECUTE_ADD, cycles: null, byteWidth: 2, name: 'add', nameFull: 'Addition' },
                { opCode: ID.OPCODE.NAND, microcodeJump: MC.EXECUTE_NAND, cycles: null, byteWidth: 2, name: 'nand', nameFull: 'Bitwise NAND' },
                { opCode: ID.OPCODE.SH, microcodeJump: MC.EXECUTE_SH, cycles: null, byteWidth: 2, name: 'sh',  nameFull: "Logical bit shift" },
                { opCode: ID.OPCODE.JNZ, microcodeJump: MC.EXECUTE_JNZ, cycles: null, byteWidth: 2, name: 'jnz', nameFull: "Jump if not zero" },
                { opCode: ID.OPCODE.COPY, microcodeJump: MC.EXECUTE_COPY, cycles: null, byteWidth: 2, name: 'copy', nameFull: "Copy" },
                { opCode: ID.OPCODE.IMM, microcodeJump: MC.EXECUTE_IMM, cycles: null, byteWidth: 4, name: 'imm', nameFull: "Immediate value" },
                { opCode: ID.OPCODE.LD, microcodeJump: MC.EXECUTE_LD_FIRST, cycles: null, byteWidth: 2, name: 'ld', nameFull: "Load" },
                { opCode: ID.OPCODE.ST, microcodeJump: MC.EXECUTE_ST_FIRST_A, cycles: null, byteWidth: 2, name: 'st', nameFull: "Store" }
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

        ID.prototype.$$checkOpCode = function(opCode, method) {
            if (opCode < 0 || opCode >= this.$$instructionSet.length) {
                throw 'InstructionDecoder.' + method + '() - unknown opCode: ' + opCode;
            }
        };

        ID.prototype.getOpCode = function () {
            //this.$$checkCpu();

            return BitUtils.shiftRight(
                this.$$cpu.register.regInstruction & 0x70000000, 
                BitUtils.BYTE_3 + BitUtils.BYTE_HALF
            );
        };

        ID.prototype.getRegOut = function () {
            //this.$$checkCpu();

            return BitUtils.shiftRight(
                this.$$cpu.register.regInstruction & 0x0F000000, 
                BitUtils.BYTE_3
            );
        };

        ID.prototype.getRegIn0 = function () {
            //this.$$checkCpu();

            return BitUtils.shiftRight(
                this.$$cpu.register.regInstruction & 0x00F00000, 
                BitUtils.BYTE_2 + BitUtils.BYTE_HALF
            );
        };

        ID.prototype.getRegIn1 = function () {
            //this.$$checkCpu();

            return BitUtils.shiftRight(
                this.$$cpu.register.regInstruction & 0x000F0000, 
                BitUtils.BYTE_2
            );
        };

        ID.prototype.getImm = function () {
            //this.$$checkCpu();
            
            return this.$$cpu.register.regInstruction & 0x0000FFFF;
        };

        ID.prototype.getByteWidth = function (opCode) {
            return this.$$byteWidthLookup[opCode];
        };

        ID.prototype.getMicrocodeJump = function (opCode) {
            return this.$$microcodeJumpLookup[opCode];
        };

        ID.prototype.getInstruction = function (opCode) {
            //this.$$checkCpu();
            //this.$$checkOpCode(opCode, 'getInstruction');

            return this.$$instructionSet[opCode];
        };

        return ID;
    }

    return _InstructionDecoder();         // TODO change it do dependency injection
})();

