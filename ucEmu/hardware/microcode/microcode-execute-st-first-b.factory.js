var MicrocodeExecuteStFirstB = (function () {
    'use strict';

    _MicrocodeExecuteStFirstB.$inject = [];

    function _MicrocodeExecuteStFirstB() {
        var MESFB;

        MESFB = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESFB.prototype = Object.create(AbstractMicrocode.prototype);
        MESFB.prototype.constructor = MESFB;

        MESFB.prototype.finalizePropagationAndStoreResults = function () {

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerExecuteStFirstB');
            }

            this.$$core.regClockTick = this.$$cc.getClockTickNext();
            this.$$core.regSequencer = this.$$MICROCODE.EXECUTE_ST_FIRST_C;
        };

        return MESFB;
    }

    return _MicrocodeExecuteStFirstB();        // TODO change it to dependency injection

})();
