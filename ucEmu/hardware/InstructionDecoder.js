var InstructionDecoder = function () {

    var
        self = this,
        INSTRUCTION_SET = []
    ;

    self.OPCODE = {
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
        INSTRUCTION_SET.push(
            { opcode: self.OPCODE.ADD, cycles: null, byteWidth: 2, name: 'add', nameFull: 'Addition' },
            { opcode: self.OPCODE.NAND, cycles: null, byteWidth: 2, name: 'nand', nameFull: 'Bitwise NAND' },
            { opcode: self.OPCODE.SH, cycles: null, byteWidth: 2, name: 'sh',  nameFull: "Logical bit shift" },
            { opcode: self.OPCODE.JNZ, cycles: null, byteWidth: 2, name: 'jnz', nameFull: "Jump if not zero" },
            { opcode: self.OPCODE.COPY, cycles: null, byteWidth: 2, name: 'copy', nameFull: "Copy" },
            { opcode: self.OPCODE.IMM, cycles: null, byteWidth: 4, name: 'imm', nameFull: "Immediate value" },
            { opcode: self.OPCODE.LD, cycles: null, byteWidth: 2, name: 'ld', nameFull: "Load" },
            { opcode: self.OPCODE.ST, cycles: null, byteWidth: 2, name: 'st', nameFull: "Store" }
        );
    }

    function checkOpcode(opcode, method)
    {
        if (opcode < 0 || opcode >= INSTRUCTION_SET.length) {
            throw 'InstructionDecoder.' + method + '() - unknown opcode: ' + opcode;
        }
    }

    self.getInstruction = function (opcode) {
        checkOpcode(opcode, 'getInstruction');

        return INSTRUCTION_SET[opcode];
    };

    construct();
};