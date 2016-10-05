var MicrocodeHandlerSh = (function () {
    'use strict';

    _MicrocodeHandlerSh.$inject = [];

    function _MicrocodeHandlerSh() {
        var MES;

        MES = function (microcode, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MES.prototype = Object.create(AbstractMicrocode.prototype);
        MES.prototype.constructor = MES;

        MES.prototype.propagate = function (registerBag, inputBag, instruction, internalResultBag) {
            var reset, regOut, regIn0, regIn1,
                regIn0Value, regIn1Value, regResult, address;

            reset = registerBag.regReset;
            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn1 = InstructionRegisterSpliter.getRegIn1(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.read(regIn0);
            regIn1Value = registerBag.registerFile.read(regIn1);
            regResult = Alu.sh(regIn0Value, regIn1Value);

            // TODO when instruction will save to PC it will produce wrong result - fixed?
            address = RegisterFile.PROGRAM_COUNTER === regOut
                ? regResult : registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER);

            internalResultBag.registerSaveIndex = regOut;
            internalResultBag.register = regResult;
            internalResultBag.sequencer = Microcode.FETCH_FIRST;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getMemoryRowAddress(address);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
            internalResultBag.memoryWE = MemoryController.getMemoryWE(inputBag.clock, this.memoryWEPositive, this.memoryWENegative);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitSize.REGISTER));
                Logger.log(3, 'regIn1Value = ' + BitUtil.hex(regIn1Value, BitSize.REGISTER));
                Logger.log(3, 'result = ' + BitUtil.hex(regResult, BitSize.REGISTER) + ' (BIT SHIFT)');
            }
        };

        return MES;
    }

    return _MicrocodeHandlerSh();        // TODO change it to dependency injection

})();
