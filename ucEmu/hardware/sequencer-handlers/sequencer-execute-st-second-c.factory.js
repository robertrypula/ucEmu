var SequencerExecuteStSecondC = (function () {
    'use strict';

    _SequencerExecuteStSecondC.$inject = [];

    function _SequencerExecuteStSecondC() {
        var SESSC;

        SESSC = function (cpu) {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SESSC.prototype = Object.create(AbstractSequencerHandler.prototype);
        SESSC.prototype.constructor = SESSC;

        SESSC.prototype.$$goToNextState = function () {

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteStSecondC');
            }

            this.$$cpu.register.regSequencer = this.$$cpu.core.sequencer.STATE.FETCH_FIRST;
        };

        return SESSC;
    }

    return _SequencerExecuteStSecondC();        // TODO change it do dependency injection

})();
