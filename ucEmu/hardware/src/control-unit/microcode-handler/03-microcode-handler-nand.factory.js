var MicrocodeHandlerNand = (function () {
    'use strict';

    _MicrocodeHandlerNand.$inject = [];

    function _MicrocodeHandlerNand() {
        var MEN;

        MEN = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEN.prototype = Object.create(AbstractMicrocode.prototype);
        MEN.prototype.constructor = MEN;

        MEN.prototype.propagateNewRegisterData = function (registerBag, inputBag, instruction, internalResultBag) {
            var regOut, regIn0, regIn1,
                regIn0Value, regIn1Value, regResult, address, sequencer;

            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn1 = InstructionRegisterSpliter.getRegIn1(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.out0(regIn0);
            regIn1Value = registerBag.registerFile.out1(regIn1);
            regResult = Alu.nand(regIn0Value, regIn1Value);

            // TODO when instruction will save to PC it will produce wrong result - fixed?
            address = RegisterFile.PROGRAM_COUNTER === regOut ? regResult : registerBag.registerFile.getProgramCounter();

            sequencer = this.microcodeJump === Microcode.JUMP_IS_AT_INSTRUCTION ? instruction.microcodeJump : this.microcodeJump;

            internalResultBag.registerSaveIndex = regOut;
            internalResultBag.register = regResult;
            internalResultBag.sequencer = sequencer;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getMemoryRowAddress(address);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MEN;
    }

    return _MicrocodeHandlerNand();        // TODO change it to dependency injection

})();
