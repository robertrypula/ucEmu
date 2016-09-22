var MicrocodeExecuteStSecondC = (function () {
    'use strict';

    _MicrocodeExecuteStSecondC.$inject = [];

    function _MicrocodeExecuteStSecondC() {
        var MESSC;

        MESSC = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESSC.prototype = Object.create(AbstractMicrocode.prototype);
        MESSC.prototype.constructor = MESSC;

        MESSC.prototype.finalizePropagationAndStoreResults = function () {

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerExecuteStSecondC');
            }

            this.$$core.regClockTick = this.$$cc.getClockTickNext();
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
        };

        return MESSC;
    }

    return _MicrocodeExecuteStSecondC();        // TODO change it to dependency injection

})();
