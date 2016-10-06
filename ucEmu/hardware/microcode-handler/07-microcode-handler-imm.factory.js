var MicrocodeHandlerImm = (function () {
    'use strict';

    _MicrocodeHandlerImm.$inject = [];

    function _MicrocodeHandlerImm() {
        var MEI;

        MEI = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEI.prototype = Object.create(AbstractMicrocode.prototype);
        MEI.prototype.constructor = MEI;

        MEI.prototype.propagate = function (registerBag, inputBag, instruction, internalResultBag) {
            var regOut, regResult, address, sequencer;

            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            regResult = InstructionRegisterSpliter.getImm(registerBag.regInstruction);

            // TODO when instruction will save to PC it will produce wrong result - fixed?
            address = RegisterFile.PROGRAM_COUNTER === regOut
                ? regResult : registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER);

            sequencer = this.microcodeJump === Microcode.JUMP_IS_AT_INSTRUCTION
                ? instruction.microcodeJump : this.microcodeJump;

            internalResultBag.registerSaveIndex = regOut;
            internalResultBag.register = regResult;
            internalResultBag.sequencer = sequencer;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getMemoryRowAddress(address);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
            internalResultBag.memoryWE = MemoryController.getMemoryWE(inputBag.clock, this.memoryWEPositive, this.memoryWENegative);
        };

        return MEI;
    }

    return _MicrocodeHandlerImm();        // TODO change it to dependency injection

})();
