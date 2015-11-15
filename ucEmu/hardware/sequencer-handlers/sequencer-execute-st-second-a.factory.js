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

            Logger.log(':: sequencerExecuteStSecondA');

            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATE.EXECUTE_ST_SECOND_B;
        };

        return SESSA;
    }

    return _SequencerExecuteStSecondA();        // TODO change it do dependency injection

})();
