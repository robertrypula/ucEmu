var MicrocodeExecuteStSecondA = (function () {
    'use strict';

    _MicrocodeExecuteStSecondA.$inject = [];

    function _MicrocodeExecuteStSecondA() {
        var MESSA;

        MESSA = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESSA.prototype = Object.create(AbstractMicrocode.prototype);
        MESSA.prototype.constructor = MESSA;

        MESSA.prototype.goToNextState = function () {

            if (Logger.isEnabled()) {
                Logger.log(2, '[ACTION] sequencerExecuteStSecondA');
            }

            this.$$core.regClockTick = this.$$cc.getClockTickNext();
            this.$$core.regSequencer = this.$$MICROCODE.EXECUTE_ST_SECOND_B;
        };

        return MESSA;
    }

    return _MicrocodeExecuteStSecondA();        // TODO change it to dependency injection

})();
