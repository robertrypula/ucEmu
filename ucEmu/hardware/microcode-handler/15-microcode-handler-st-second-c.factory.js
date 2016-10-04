var MicrocodeHandlerStSecondC = (function () {
    'use strict';

    _MicrocodeHandlerStSecondC.$inject = [];

    function _MicrocodeHandlerStSecondC() {
        var MESSC;

        MESSC = function (microcode, writeEnablePositive, writeEnableNegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESSC.prototype = Object.create(AbstractMicrocode.prototype);
        MESSC.prototype.constructor = MESSC;

        MESSC.prototype.finalizePropagationAndStoreResults = function (registerBag, inputBag, instruction, internalResultBag) {
            var reset;

            reset = registerBag.regReset;
            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
            }

            if (reset) {
                registerBag.resetAll();
            } else {
                registerBag.regClockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
                registerBag.regMemoryRowAddress = MemoryController.getMemoryRowAddress(registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER)); // TODO when instruction will save also to PC it will produce troubles in real circuit
                registerBag.regSequencer = Microcode.FETCH_FIRST;
            }
            registerBag.regReset = inputBag.reset;
        };

        return MESSC;
    }

    return _MicrocodeHandlerStSecondC();        // TODO change it to dependency injection

})();
