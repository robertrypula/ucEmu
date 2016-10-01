var MicrocodeHandlerStSecondA = (function () {
    'use strict';

    _MicrocodeHandlerStSecondA.$inject = [];

    function _MicrocodeHandlerStSecondA() {
        var MESSA;

        MESSA = function (microcode) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESSA.prototype = Object.create(AbstractMicrocode.prototype);
        MESSA.prototype.constructor = MESSA;

        MESSA.prototype.finalizePropagationAndStoreResults = function (registerBag, memoryRead) {

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerStSecondA');
            }

            registerBag.regClockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            registerBag.regSequencer = Microcode.ST_SECOND_B;
        };

        return MESSA;
    }

    return _MicrocodeHandlerStSecondA();        // TODO change it to dependency injection

})();
