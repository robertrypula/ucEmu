var MicrocodeHandlerJnz = (function () {
    'use strict';

    _MicrocodeHandlerJnz.$inject = [];

    function _MicrocodeHandlerJnz() {
        var MEJ;

        MEJ = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEJ.prototype = Object.create(AbstractMicrocode.prototype);
        MEJ.prototype.constructor = MEJ;

        MEJ.prototype.propagate = function (registerBag, inputBag, instruction, internalResultBag) {
            var regIn0, regIn1, regIn0Value, regIn1Value,
                notZeroFlag, regPCNext, address, sequencer;

            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn1 = InstructionRegisterSpliter.getRegIn1(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.read(regIn0);
            regIn1Value = registerBag.registerFile.read(regIn1);
            notZeroFlag = regIn1Value !== 0;
            regPCNext = notZeroFlag ? regIn0Value : registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER);

            // TODO when instruction will save to PC it will produce wrong result - fixed?
            address = regPCNext;

            sequencer = this.microcodeJump === Microcode.JUMP_IS_AT_INSTRUCTION
                ? instruction.microcodeJump : this.microcodeJump;

            internalResultBag.registerSaveIndex = RegisterFile.PROGRAM_COUNTER;
            internalResultBag.register = regPCNext;
            internalResultBag.sequencer = sequencer;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getMemoryRowAddress(address);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
            internalResultBag.memoryWE = MemoryController.getMemoryWE(inputBag.clock, this.memoryWEPositive, this.memoryWENegative);
        };

        return MEJ;
    }

    return _MicrocodeHandlerJnz();        // TODO change it to dependency injection

})();
