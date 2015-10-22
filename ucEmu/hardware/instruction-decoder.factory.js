var InstructionDecoder = (function () {
    'use strict';

    var InstructionDecoder = function () {
        var
            self = this,
            cpu = null,
            instructionSet = []
        ;

        self.OPCODES = {
            ADD: 0,
            NAND: 1,
            SH: 2,
            JNZ: 3,
            COPY: 4,
            IMM: 5,
            LD: 6,
            ST: 7
        };

        function construct()
        {
            instructionSet.push(
                { opcode: self.OPCODES.ADD, cycles: null, byteWidth: 2, name: 'add', nameFull: 'Addition' },
                { opcode: self.OPCODES.NAND, cycles: null, byteWidth: 2, name: 'nand', nameFull: 'Bitwise NAND' },
                { opcode: self.OPCODES.SH, cycles: null, byteWidth: 2, name: 'sh',  nameFull: "Logical bit shift" },
                { opcode: self.OPCODES.JNZ, cycles: null, byteWidth: 2, name: 'jnz', nameFull: "Jump if not zero" },
                { opcode: self.OPCODES.COPY, cycles: null, byteWidth: 2, name: 'copy', nameFull: "Copy" },
                { opcode: self.OPCODES.IMM, cycles: null, byteWidth: 4, name: 'imm', nameFull: "Immediate value" },
                { opcode: self.OPCODES.LD, cycles: null, byteWidth: 2, name: 'ld', nameFull: "Load" },
                { opcode: self.OPCODES.ST, cycles: null, byteWidth: 2, name: 'st', nameFull: "Store" }
            );
        }

        function checkOpcode(opcode, method)
        {
            if (opcode < 0 || opcode >= instructionSet.length) {
                throw 'InstructionDecoder.' + method + '() - unknown opcode: ' + opcode;
            }
        }

        self.getOpcode = function () {
            return BitUtils.shiftRight(cpu.registers.regInstruction & 0x70000000, BitUtils.BYTE_3 + BitUtils.BYTE_HALF);
        }

        self.getRegOut = function () {
            checkCpu();
            return BitUtils.shiftRight(cpu.registers.regInstruction & 0x0F000000, BitUtils.BYTE_3);
        }

        self.getRegIn0 = function () {
            checkCpu();
            return BitUtils.shiftRight(cpu.registers.regInstruction & 0x00F00000, BitUtils.BYTE_2 + BitUtils.BYTE_HALF);
        }

        self.getRegIn1 = function () {
            checkCpu();
            return BitUtils.shiftRight(cpu.registers.regInstruction & 0x000F0000, BitUtils.BYTE_2);
        }

        self.getImm = function () {
            checkCpu();
            return cpu.registers.regInstruction & 0x0000FFFF;
        }

        self.getInstruction = function (opcode) {
            checkCpu();
            checkOpcode(opcode, 'getInstruction');

            return instructionSet[opcode];
        };

        self.setCpu = function (cpuSelf)
        {
            cpu = cpuSelf;
        };

        function checkCpu()
        {
            if (cpu === null) {
                throw 'Please attach cpu first';
            }
        }

        construct();
    };

    return InstructionDecoder;         // TODO change it to DI

})();

