var MicrocodeHandlerLdSecond = (function () {
    'use strict';

    _MicrocodeHandlerLdSecond.$inject = [];

    function _MicrocodeHandlerLdSecond() {
        var MELS;

        MELS = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MELS.prototype = Object.create(AbstractMicrocode.prototype);
        MELS.prototype.constructor = MELS;

        MELS.prototype.propagateNewRegisterData = function (registerBag, memoryRead, instruction, internalResultBag) {
            var regIn0, addressByteFromReg, regOut, regResult,
                memoryReadFinal, addressByte, sequencer,
                addressRow, addressRowAsWord;

            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            addressByteFromReg = registerBag.registerFile.out0(regIn0);

            memoryReadFinal = MemoryController.getMemoryReadShiftedPhaseTwo(addressByteFromReg, memoryRead, registerBag.regMemoryBuffer);
            regResult = MemoryController.getRegisterResultFromMemoryReadFinal(memoryReadFinal);

            // TODO when instruction will save to PC it will produce wrong result - fixed?
            addressByte = RegisterFile.PROGRAM_COUNTER === regOut ? regResult : registerBag.registerFile.getProgramCounter();

            addressRowAsWord = MemoryController.getAddressRowAsWord(addressByte);
            addressRow = MemoryController.getAddressRowFromAddressRowAsWord(addressRowAsWord);

            sequencer = this.microcodeJump === Microcode.JUMP_IS_AT_INSTRUCTION ? instruction.microcodeJump : this.microcodeJump;

            internalResultBag.registerSaveIndex = regOut;
            internalResultBag.register = regResult;
            internalResultBag.sequencer = sequencer;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            internalResultBag.memoryBuffer = memoryReadFinal;      // TODO probably not needed
            internalResultBag.memoryRowAddress = addressRow;
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MELS;
    }

    return _MicrocodeHandlerLdSecond();        // TODO change it to dependency injection

})();
