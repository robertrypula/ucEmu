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
            var reset, regIn0, regIn0Value;

            reset = registerBag.regReset;
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.read(regIn0);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'regIn0 = ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitSize.REGISTER));
            }

            if (reset) {
                registerBag.resetAll();
            } else {
                registerBag.regClockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
                registerBag.regMemoryRowAddress = MemoryController.getMemoryRowAddressNextRow(regIn0Value);
                registerBag.regSequencer = Microcode.ST_SECOND_A;
            }
            registerBag.regReset = inputBag.reset;
        };

        return MESFC;
    }

    return _MicrocodeHandlerStFirstC();        // TODO change it to dependency injection

})();
