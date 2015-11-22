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

        MESSC.prototype.$$goToNextState = function () {

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteStSecondC');
            }

            this.$$reg.regSequencer = this.$$MICROCODE.FETCH_FIRST;
        };

        return MESSC;
    }

    return _MicrocodeExecuteStSecondC();        // TODO change it do dependency injection

})();
