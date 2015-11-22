var SequencerExecuteStSecondB = (function () {
    'use strict';

    _SequencerExecuteStSecondB.$inject = [];

    function _SequencerExecuteStSecondB() {
        var SESSB;

        SESSB = function (cpu) {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SESSB.prototype = Object.create(AbstractSequencerHandler.prototype);
        SESSB.prototype.constructor = SESSB;

        SESSB.prototype.$$goToNextState = function () {

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteStSecondB');
            }

            this.$$reg.regSequencer = this.$$MICROCODE.EXECUTE_ST_SECOND_C;
        };

        return SESSB;
    }

    return _SequencerExecuteStSecondB();        // TODO change it do dependency injection

})();
