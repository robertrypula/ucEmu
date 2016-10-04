var MicrocodeHandlerAdd = (function () {
    'use strict';

     _MicrocodeHandlerAdd.$inject = [];

    function _MicrocodeHandlerAdd() {
        var MEA;

        MEA = function (microcode, writeEnablePositive, writeEnableNegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEA.prototype = Object.create(AbstractMicrocode.prototype);
        MEA.prototype.constructor = MEA;

        MEA.prototype.finalizePropagationAndStoreResults = function (registerBag, inputBag, instruction, internalResultBag) {
            var reset, regOut, regIn0, regIn1,
                regIn0Value, regIn1Value, regResult, address;

            reset = registerBag.regReset;
            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn1 = InstructionRegisterSpliter.getRegIn1(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.read(regIn0);
            regIn1Value = registerBag.registerFile.read(regIn1);
            regResult = Alu.add(regIn0Value, regIn1Value);

            address = registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER);

            internalResultBag.register = regResult;
            internalResultBag.registerSaveIndex = regOut;
            internalResultBag.sequencer = Microcode.FETCH_FIRST;
            internalResultBag.clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            internalResultBag.memoryRowAddress = MemoryController.getMemoryRowAddress(address); // TODO when instruction will save to PC it will produce wrong result

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitSize.REGISTER));
                Logger.log(3, 'regIn1Value = ' + BitUtil.hex(regIn1Value, BitSize.REGISTER));
                Logger.log(3, 'result = ' + BitUtil.hex(regResult, BitSize.REGISTER) + ' (sum)');
            }

            if (reset) {
                registerBag.resetAll();
            } else {
                registerBag.registerFile.save(
                    internalResultBag.registerSaveIndex,
                    internalResultBag.register
                );
                registerBag.regSequencer = internalResultBag.sequencer;
                // internalResultBag.instruction
                registerBag.regClockTick = internalResultBag.clockTick;
                // internalResultBag.memoryBuffer
                registerBag.regMemoryRowAddress = internalResultBag.memoryRowAddress;
                // internalResultBag.memoryWrite;
                // internalResultBag.writeEnable;
            }
            registerBag.regReset = inputBag.reset;
        };

        return MEA;
    }

    return _MicrocodeHandlerAdd();        // TODO change it to dependency injection

})();
