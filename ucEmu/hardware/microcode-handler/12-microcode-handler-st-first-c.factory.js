var MicrocodeHandlerStFirstC = (function () {
    'use strict';

    _MicrocodeHandlerStFirstC.$inject = [];

    function _MicrocodeHandlerStFirstC() {
        var MESFC;

        MESFC = function (microcode, writeEnablePositive, writeEnableNegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESFC.prototype = Object.create(AbstractMicrocode.prototype);
        MESFC.prototype.constructor = MESFC;

        MESFC.prototype.finalizePropagationAndStoreResults = function (registerBag, inputBag, instruction, internalResultBag) {
            var dummyRegisterValue, regIn0, regIn0Value;

            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.read(regIn0);
            dummyRegisterValue = registerBag.registerFile.read(RegisterFile.DUMMY_REGISTER);

            internalResultBag.registerSaveIndex = RegisterFile.DUMMY_REGISTER;
            internalResultBag.register = dummyRegisterValue;
            internalResultBag.sequencer = Microcode.ST_SECOND_A;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = MemoryController.getMemoryRowAddressNextRow(regIn0Value);
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
            internalResultBag.writeEnable = MemoryController.getWriteEnable(inputBag.clock, this.writeEnablePositive, this.writeEnableNegative);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'regIn0 = ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitSize.REGISTER));
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

        return MESFC;
    }

    return _MicrocodeHandlerStFirstC();        // TODO change it to dependency injection

})();
