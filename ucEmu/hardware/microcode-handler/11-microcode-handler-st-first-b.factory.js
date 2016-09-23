var MicrocodeHandlerStFirstB = (function () {
    'use strict';

    _MicrocodeHandlerStFirstB.$inject = [];

    function _MicrocodeHandlerStFirstB() {
        var MESFB;

        MESFB = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESFB.prototype = Object.create(AbstractMicrocode.prototype);
        MESFB.prototype.constructor = MESFB;

        MESFB.prototype.finalizePropagationAndStoreResults = function () {

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerStFirstB');
            }

            this.$$core.regClockTick = this.$$cc.getClockTickNext();
            this.$$core.regSequencer = this.$$MICROCODE.ST_FIRST_C;
        };

        return MESFB;
    }

    return _MicrocodeHandlerStFirstB();        // TODO change it to dependency injection

})();
