var MicrocodeHandlerStFirstB = (function () {
    'use strict';

    _MicrocodeHandlerStFirstB.$inject = [];

    function _MicrocodeHandlerStFirstB() {
        var MESFB;

        MESFB = function (microcode) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESFB.prototype = Object.create(AbstractMicrocode.prototype);
        MESFB.prototype.constructor = MESFB;

        MESFB.prototype.finalizePropagationAndStoreResults = function (registerBag, memoryRead) {

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerStFirstB');
            }

            registerBag.regClockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            registerBag.regSequencer = Microcode.ST_FIRST_C;
        };

        return MESFB;
    }

    return _MicrocodeHandlerStFirstB();        // TODO change it to dependency injection

})();
