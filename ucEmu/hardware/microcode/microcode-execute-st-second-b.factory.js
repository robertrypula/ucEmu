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

        MESSB.prototype.$$goToNextState = function () {

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteStSecondB');
            }

            this.$$reg.regSequencer = this.$$MICROCODE.EXECUTE_ST_SECOND_C;
        };

        return MESSB;
    }

    return _MicrocodeExecuteStSecondB();        // TODO change it do dependency injection

})();
