var MicrocodeHandlerStSecondC = (function () {
    'use strict';

    _MicrocodeHandlerStSecondC.$inject = [];

    function _MicrocodeHandlerStSecondC() {
        var MESSC;

        MESSC = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESSC.prototype = Object.create(AbstractMicrocode.prototype);
        MESSC.prototype.constructor = MESSC;

        MESSC.prototype.finalizePropagationAndStoreResults = function () {

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerStSecondC');
            }

            this.$$core.regClockTick = this.$$cc.getClockTickNext();
            this.$$core.regMemoryRowAddress = this.$$memCtrl.getMemoryRowAddress(this.$$regFile.getProgramCounter()); // TODO when instruction will save also to PC it will produce troubles in real circuit
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
        };

        return MESSC;
    }

    return _MicrocodeHandlerStSecondC();        // TODO change it to dependency injection

})();
