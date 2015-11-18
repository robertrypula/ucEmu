var InstructionDecoder = (function () {
    'use strict';

    _InstructionDecoder.$inject = [];

    function _InstructionDecoder() {
        var ID;

        ID = function (cpu) {
            CpuAware.apply(this, arguments);

            this.OPCODE = null;
            this.$$instructionSet = [];
            this.$$byteWidthLookup;
            
            this.$$initialize();
        };

        ID.prototype = Object.create(CpuAware.prototype);
        ID.prototype.constructor = ID;

        ID.prototype.$$initialize = function () {
            this.$$initializeOpcode();
            this.$$initializeInstructionSet();
            this.$$buildByteWidthLookup();
        };

        ID.prototype.$$initializeOpcode = function () {
            this.OPCODE = {
                ADD: 0,
                NAND: 1,
                SH: 2,
                JNZ: 3,
                COPY: 4,
                IMM: 5,
                LD: 6,
                ST: 7
            };
        };

        ID.prototype.$$initializeInstructionSet = function () {
            this.$$instructionSet.push(
                { opcode: this.OPCODE.ADD, cycles: null, byteWidth: 2, name: 'add', nameFull: 'Addition' },
                { opcode: this.OPCODE.NAND, cycles: null, byteWidth: 2, name: 'nand', nameFull: 'Bitwise NAND' },
                { opcode: this.OPCODE.SH, cycles: null, byteWidth: 2, name: 'sh',  nameFull: "Logical bit shift" },
                { opcode: this.OPCODE.JNZ, cycles: null, byteWidth: 2, name: 'jnz', nameFull: "Jump if not zero" },
                { opcode: this.OPCODE.COPY, cycles: null, byteWidth: 2, name: 'copy', nameFull: "Copy" },
                { opcode: this.OPCODE.IMM, cycles: null, byteWidth: 4, name: 'imm', nameFull: "Immediate value" },
                { opcode: this.OPCODE.LD, cycles: null, byteWidth: 2, name: 'ld', nameFull: "Load" },
                { opcode: this.OPCODE.ST, cycles: null, byteWidth: 2, name: 'st', nameFull: "Store" }
            );
        };

        ID.prototype.$$buildByteWidthLookup = function () {
            this.$$byteWidthLookup = new Uint8Array(this.$$instructionSet.length);

            for (var i = 0; i < this.$$instructionSet.length; i++) {
                this.$$byteWidthLookup[i] = this.$$instructionSet[i].byteWidth;
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

        ID.prototype.getByteWidth = function (opcode) {
            return this.$$byteWidthLookup[opcode];
        };

        ID.prototype.getInstruction = function (opcode) {
            //this.$$checkCpu();
            //this.$$checkOpcode(opcode, 'getInstruction');

            return this.$$instructionSet[opcode];
        };

        return ID;
    }

    return _InstructionDecoder();         // TODO change it do dependency injection
})();

