var MicrocodeExecuteStFirstC = (function () {
    'use strict';

    _MicrocodeExecuteStFirstC.$inject = [];

    function _MicrocodeExecuteStFirstC() {
        var MESFC;

        MESFC = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESFC.prototype = Object.create(AbstractMicrocode.prototype);
        MESFC.prototype.constructor = MESFC;

        MESFC.prototype.goToNextState = function () {

            if (Logger.isEnabled()) {
                Logger.log(2, '[ACTION] sequencerExecuteStFirstC');
            }

            this.$$core.regClockTick = this.$$cc.getClockTickNext();
            this.$$core.regSequencer = this.$$MICROCODE.EXECUTE_ST_SECOND_A;
        };

        return MESFC;
    }

    return _MicrocodeExecuteStFirstC();        // TODO change it to dependency injection

})();
