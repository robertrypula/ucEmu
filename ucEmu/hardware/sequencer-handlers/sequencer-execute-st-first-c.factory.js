var SequencerExecuteStFirstC = (function () {
    'use strict';

    _SequencerExecuteStFirstC.$inject = [];

    function _SequencerExecuteStFirstC() {
        var SESFC;

        SESFC = function (cpu) {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SESFC.prototype = Object.create(AbstractSequencerHandler.prototype);
        SESFC.prototype.constructor = SESFC;

        SESFC.prototype.$$goToNextState = function () {

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteStFirstC');
            }

            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATE.EXECUTE_ST_SECOND_A;
        };

        return SESFC;
    }

    return _SequencerExecuteStFirstC();        // TODO change it do dependency injection

})();
