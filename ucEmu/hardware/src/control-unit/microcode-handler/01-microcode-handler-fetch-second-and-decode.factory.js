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

        MFSAD.prototype.propagateNewRegisterData = function (registerBag, memoryRead, instruction, internalResultBag) {
            var column, columnFromTheBack, memoryReadShifted, memoryReadFinal,
                address,
                register, regMemoryRowAddressNext,
                regIn0, regIn0Value, clockTick,
                sequencer, addressRowForAlu, addressRow;

            address = registerBag.registerFile.getProgramCounter();

            register = Alu.add(address, instruction.byteWidth);

            sequencer = this.microcodeJump === Microcode.JUMP_IS_AT_INSTRUCTION ? instruction.microcodeJump : this.microcodeJump;

            column = MemoryController.getColumn(address);
            columnFromTheBack = MemoryController.getColumnFromTheBack(column);
            memoryReadShifted = MemoryController.getMemoryReadShiftedRight(memoryRead, columnFromTheBack);
            memoryReadFinal = MemoryController.getMemoryReadFinal(memoryReadShifted, registerBag.regMemoryBuffer);

            clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);

            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.out0(regIn0);
            regMemoryRowAddressNext = instruction.memoryRowAddressFromRegIn0 ? regIn0Value : register;

            addressRowForAlu = MemoryController.getAddressRowForAlu(regMemoryRowAddressNext);
            addressRow = MemoryController.getAddressRow(addressRowForAlu);

            internalResultBag.registerSaveIndex = RegisterFile.PROGRAM_COUNTER;
            internalResultBag.register = register;
            internalResultBag.sequencer = sequencer;
            internalResultBag.instruction = memoryReadFinal;
            internalResultBag.clockTick = clockTick;
            internalResultBag.memoryBuffer = memoryReadFinal;             // TODO probably not needed
            internalResultBag.memoryRowAddress = addressRow;
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MFSAD;
    }

    return _MicrocodeHandlerFetchSecondAndDecode();        // TODO change it to dependency injection

})();