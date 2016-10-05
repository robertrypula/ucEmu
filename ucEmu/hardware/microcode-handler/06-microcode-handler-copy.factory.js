var MicrocodeHandlerCopy = (function () {
    'use strict';

    _MicrocodeHandlerCopy.$inject = [];

    function _MicrocodeHandlerCopy() {
        var MEC;

        MEC = function (microcode, writeEnablePositive, writeEnableNegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEC.prototype = Object.create(AbstractMicrocode.prototype);
        MEC.prototype.constructor = MEC;

        MEC.prototype.finalizePropagationAndStoreResults = function (registerBag, inputBag, instruction, internalResultBag) {
            var regOut, regIn0, regResult, address;

            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regResult = registerBag.registerFile.read(regIn0);

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
            internalResultBag.writeEnable = MemoryController.getWriteEnable(inputBag.clock, this.writeEnablePositive, this.writeEnableNegative);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'regOut, regIn0 <-> ' + regOut + ', ' + regIn0);
                Logger.log(3, 'regResult = ' + BitUtil.hex(regResult, BitSize.REGISTER) + " (COPY, save regResult at regOut)");
            }

            if (registerBag.regReset) {
                registerBag.resetAll();
            } else {
                registerBag.registerFile.save(
                    internalResultBag.registerSaveIndex,
                    internalResultBag.register
                );
                registerBag.regSequencer = internalResultBag.sequencer;
                registerBag.regInstruction = internalResultBag.instruction;
                registerBag.regClockTick = internalResultBag.clockTick;
                registerBag.regMemoryBuffer = internalResultBag.memoryBuffer;
                registerBag.regMemoryRowAddress = internalResultBag.memoryRowAddress;
                registerBag.regMemoryWrite = internalResultBag.memoryWrite;
            }
            registerBag.regReset = inputBag.reset;
        };

        return MEC;
    }

    return _MicrocodeHandlerCopy();        // TODO change it to dependency injection

})();
