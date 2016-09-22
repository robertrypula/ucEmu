var MicrocodeExecuteStSecondB = (function () {
    'use strict';

    _MicrocodeExecuteStSecondB.$inject = [];

    function _MicrocodeExecuteStSecondB() {
        var MESSB;

        MESSB = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESSB.prototype = Object.create(AbstractMicrocode.prototype);
        MESSB.prototype.constructor = MESSB;

        MESSB.prototype.goToNextState = function () {

            if (Logger.isEnabled()) {
                Logger.log(2, '[ACTION] sequencerExecuteStSecondB');
            }

            this.$$core.regClockTick = this.$$cc.getClockTickNext();
            this.$$core.regSequencer = this.$$MICROCODE.EXECUTE_ST_SECOND_C;
        };

        return MESSB;
    }

    return _MicrocodeExecuteStSecondB();        // TODO change it to dependency injection

})();
