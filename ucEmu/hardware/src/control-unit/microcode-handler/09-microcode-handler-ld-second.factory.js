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
            var regIn0, regIn0Value, regOut, regResult, column, columnFromTheBack,
                memoryReadShifted, memoryReadFinal, address, sequencer;

            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.out0(regIn0);

            column = MemoryController.getColumn(regIn0Value);
            columnFromTheBack = MemoryController.getColumnFromTheBack(column);
            memoryReadShifted = MemoryController.getMemoryReadShiftedRight(memoryRead, columnFromTheBack);
            memoryReadFinal = MemoryController.getMemoryReadFinal(memoryReadShifted, registerBag.regMemoryBuffer);

            regResult = MemoryController.getRegisterResultFromMemoryReadFinal(memoryReadFinal);

            // TODO when instruction will save to PC it will produce wrong result - fixed?
            address = RegisterFile.PROGRAM_COUNTER === regOut
                ? regResult : registerBag.registerFile.getProgramCounter();

            sequencer = this.microcodeJump === Microcode.JUMP_IS_AT_INSTRUCTION
                ? instruction.microcodeJump : this.microcodeJump;

            internalResultBag.registerSaveIndex = regOut;
            internalResultBag.register = regResult;
            internalResultBag.sequencer = sequencer;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            internalResultBag.memoryBuffer = memoryReadFinal;      // TODO probably not needed
            internalResultBag.memoryRowAddress = MemoryController.getMemoryRowAddress(address);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MELS;
    }

    return _MicrocodeHandlerLdSecond();        // TODO change it to dependency injection

})();