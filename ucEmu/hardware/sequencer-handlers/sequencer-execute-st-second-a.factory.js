var SequencerExecuteStSecondA = (function () {
    'use strict';

    _SequencerExecuteStSecondA.$inject = [];

    function _SequencerExecuteStSecondA() {
        var SESSA;

        SESSA = function (cpu) {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SESSA.prototype = Object.create(AbstractSequencerHandler.prototype);
        SESSA.prototype.constructor = SESSA;

        SESSA.prototype.$$goToNextState = function () {

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteStSecondA');
            }

            this.$$reg.regSequencer = this.$$MICROCODE.EXECUTE_ST_SECOND_B;
        };

        return SESSA;
    }

    return _SequencerExecuteStSecondA();        // TODO change it do dependency injection

})();
