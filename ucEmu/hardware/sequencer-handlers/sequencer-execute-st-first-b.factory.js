var SequencerExecuteStFirstB = (function () {
    'use strict';

    _SequencerExecuteStFirstB.$inject = [];

    function _SequencerExecuteStFirstB() {
        var SESFB;

        SESFB = function (cpu) {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SESFB.prototype = Object.create(AbstractSequencerHandler.prototype);
        SESFB.prototype.constructor = SESFB;

        SESFB.prototype.$$goToNextState = function () {

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteStFirstB');
            }

            this.$$cpu.register.regSequencer = this.$$cpu.core.sequencer.STATE.EXECUTE_ST_FIRST_C;
        };

        return SESFB;
    }

    return _SequencerExecuteStFirstB();        // TODO change it do dependency injection

})();
