var MicrocodeHandlerStSecondB = (function () {
    'use strict';

    _MicrocodeHandlerStSecondB.$inject = [];

    function _MicrocodeHandlerStSecondB() {
        var MESSB;

        MESSB = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESSB.prototype = Object.create(AbstractMicrocode.prototype);
        MESSB.prototype.constructor = MESSB;

        MESSB.prototype.finalizePropagationAndStoreResults = function () {

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerStSecondB');
            }

            this.$$core.regClockTick = ClockTick.getClockTickNext(this.$$core.regClockTick);
            this.$$core.regSequencer = this.$$MICROCODE.ST_SECOND_C;
        };

        return MESSB;
    }

    return _MicrocodeHandlerStSecondB();        // TODO change it to dependency injection

})();
