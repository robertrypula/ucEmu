var MicrocodeHandlerStSecondA = (function () {
    'use strict';

    _MicrocodeHandlerStSecondA.$inject = [];

    function _MicrocodeHandlerStSecondA() {
        var MESSA;

        MESSA = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESSA.prototype = Object.create(AbstractMicrocode.prototype);
        MESSA.prototype.constructor = MESSA;

        MESSA.prototype.finalizePropagationAndStoreResults = function () {

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerStSecondA');
            }

            this.$$core.regClockTick = this.$$cc.getClockTickNext();
            this.$$core.regSequencer = this.$$MICROCODE.ST_SECOND_B;
        };

        return MESSA;
    }

    return _MicrocodeHandlerStSecondA();        // TODO change it to dependency injection

})();
