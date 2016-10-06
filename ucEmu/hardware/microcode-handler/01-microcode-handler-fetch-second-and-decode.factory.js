var MicrocodeHandlerFetchSecondAndDecode = (function () {
    'use strict';

    /*
     RAM content:
     0x00 0x00 0xaa 0xbb
     0xcc 0xdd 0x00 0x00

     Fetch first
     0xaa 0xbb ____ ____     << aCol with zero fill

     Fetch second
     ____ ____ 0xcc 0xdd     >> 4-aCol width zero fill
    */

    _MicrocodeHandlerFetchSecondAndDecode.$inject = [];

    function _MicrocodeHandlerFetchSecondAndDecode() {
        var MFSAD;

        MFSAD = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MFSAD.prototype = Object.create(AbstractMicrocode.prototype);
        MFSAD.prototype.constructor = MFSAD;

        MFSAD.prototype.propagate = function (registerBag, inputBag, instruction, internalResultBag) {
            var column, columnFromTheBack, memoryReadShifted, memoryReadFinal,
                opcode, byteWidth, address,
                regProgramCounterNext, regMemoryRowAddressNext,
                regIn0, regIn0Value, clockTick,
                sequencer;

            address = registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER);

            column = MemoryController.getColumn(address);
            columnFromTheBack = MemoryController.getColumnFromTheBack(column);
            memoryReadShifted = MemoryController.getMemoryReadShiftedRight(columnFromTheBack);
            memoryReadFinal = MemoryController.getMemoryReadFinal(memoryReadShifted, registerBag.regMemoryBuffer);

            opcode = instruction.opcode;
            byteWidth = instruction.byteWidth;

            regProgramCounterNext = Alu.add(address, byteWidth);

            sequencer = this.microcodeJump === Microcode.JUMP_IS_AT_INSTRUCTION
                ? instruction.microcodeJump : this.microcodeJump;

            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.read(regIn0);
            regMemoryRowAddressNext = instruction.memoryRowAddressFromRegIn0 ? regIn0Value : regProgramCounterNext;

            clockTick = registerBag.regClockTick;

            internalResultBag.registerSaveIndex = RegisterFile.PROGRAM_COUNTER;
            internalResultBag.register = regProgramCounterNext;
            internalResultBag.sequencer = sequencer;
            internalResultBag.instruction = memoryReadFinal;
            internalResultBag.clockTick = ClockTick.getClockTickNext(clockTick);
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getMemoryRowAddress(regMemoryRowAddressNext);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
            internalResultBag.memoryWE = MemoryController.getMemoryWE(inputBag.clock, this.memoryWEPositive, this.memoryWENegative);
        };

        return MFSAD;
    }

    return _MicrocodeHandlerFetchSecondAndDecode();        // TODO change it to dependency injection

})();
