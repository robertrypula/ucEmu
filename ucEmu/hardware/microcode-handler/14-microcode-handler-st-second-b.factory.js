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

        MESSB.prototype.finalizePropagationAndStoreResults = function (registerBag, instruction, memoryRead) {

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerStSecondB');
                Logger.log(3, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
            }

            registerBag.regClockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            registerBag.regSequencer = Microcode.ST_SECOND_C;
        };

        return MESSB;
    }

    return _MicrocodeHandlerStSecondB();        // TODO change it to dependency injection

})();
