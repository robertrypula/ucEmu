var InstructionBuilder = (function () {
    'use strict';

    _InstructionBuilder.$inject = [];

    function _InstructionBuilder() {
        function build(opcode, microcodeJump, byteWidth, addressByteFromReg, name, nameFull) {
            var instruction, O;

            O = Opcode;
            instruction = null;

            switch (opcode) {
                case O.ADD:
                    instruction = new InstructionAdd(
                        opcode, microcodeJump, byteWidth, addressByteFromReg, name, nameFull
                    );
                    break;
                case O.NAND:
                    instruction = new InstructionNand(
                        opcode, microcodeJump, byteWidth, addressByteFromReg, name, nameFull
                    );
                    break;
                case O.SH:
                    instruction = new InstructionSh(
                        opcode, microcodeJump, byteWidth, addressByteFromReg, name, nameFull
                    );
                    break;
                case O.JZ:
                    instruction = new InstructionJz(
                        opcode, microcodeJump, byteWidth, addressByteFromReg, name, nameFull
                    );
                    break;
                case O.COPY:
                    instruction = new InstructionCopy(
                        opcode, microcodeJump, byteWidth, addressByteFromReg, name, nameFull
                    );
                    break;
                case O.IMM:
                    instruction = new InstructionImm(
                        opcode, microcodeJump, byteWidth, addressByteFromReg, name, nameFull
                    );
                    break;
                case O.LD:
                    instruction = new InstructionLd(
                        opcode, microcodeJump, byteWidth, addressByteFromReg, name, nameFull
                    );
                    break;
                case O.ST:
                    instruction = new InstructionSt(
                        opcode, microcodeJump, byteWidth, addressByteFromReg, name, nameFull
                    );
                    break;
                case O.NOT_YET_DECODED:
                    instruction = new InstructionNotYetDecoded(
                        opcode, microcodeJump, byteWidth, addressByteFromReg, name, nameFull
                    );
                    break;
            }

            if (!instruction) {
                throw 'Cannot build instruction: ' + opcode;
            }

            return instruction;
        }

        return {
            build: build
        };
    }

    return new _InstructionBuilder();        // TODO change it to dependency injection

})();
