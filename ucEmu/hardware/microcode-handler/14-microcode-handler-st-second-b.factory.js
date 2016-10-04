var MicrocodeHandlerStSecondB = (function () {
    'use strict';

    _MicrocodeHandlerStSecondB.$inject = [];

    function _MicrocodeHandlerStSecondB() {
        var MESSB;

        MESSB = function (microcode, writeEnablePositive, writeEnableNegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESSB.prototype = Object.create(AbstractMicrocode.prototype);
        MESSB.prototype.constructor = MESSB;

        MESSB.prototype.finalizePropagationAndStoreResults = function (registerBag, inputBag, instruction, internalResultBag) {
            var reset;

            reset = registerBag.regReset;

            internalResultBag.sequencer = Microcode.ST_SECOND_C;
            internalResultBag.clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
            }

            if (reset) {
                registerBag.resetAll();
            } else {
                // internalResultBag.register
                // internalResultBag.registerSaveIndex
                registerBag.regSequencer = internalResultBag.sequencer;
                // internalResultBag.instruction
                registerBag.regClockTick = internalResultBag.clockTick;
                // internalResultBag.memoryBuffer
                // internalResultBag.memoryRowAddress
                // internalResultBag.memoryWrite
                // internalResultBag.writeEnable
            }
            registerBag.regReset = inputBag.reset;
        };

        return MESSB;
    }

    return _MicrocodeHandlerStSecondB();        // TODO change it to dependency injection

})();
