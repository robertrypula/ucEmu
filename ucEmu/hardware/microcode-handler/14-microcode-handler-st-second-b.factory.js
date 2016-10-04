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
            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
            }

            if (reset) {
                registerBag.resetAll();
            } else {
                registerBag.regClockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
                registerBag.regSequencer = Microcode.ST_SECOND_C;
            }
            registerBag.regReset = inputBag.reset;
        };

        return MESSB;
    }

    return _MicrocodeHandlerStSecondB();        // TODO change it to dependency injection

})();
