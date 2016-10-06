var MicrocodeHandlerAdd = (function () {
    'use strict';

     _MicrocodeHandlerAdd.$inject = [];

    function _MicrocodeHandlerAdd() {
        var MEA;

        MEA = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEA.prototype = Object.create(AbstractMicrocode.prototype);
        MEA.prototype.constructor = MEA;

        MEA.prototype.propagate = function (registerBag, inputBag, instruction, internalResultBag) {
            var regOut, regIn0, regIn1,
                regIn0Value, regIn1Value, regResult, address, sequencer;

            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn1 = InstructionRegisterSpliter.getRegIn1(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.read(regIn0);
            regIn1Value = registerBag.registerFile.read(regIn1);
            regResult = Alu.add(regIn0Value, regIn1Value);

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

        return MEA;
    }

    return _MicrocodeHandlerAdd();        // TODO change it to dependency injection

})();
