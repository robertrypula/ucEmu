var MicrocodeExecuteCopy = (function () {
    'use strict';

    _MicrocodeExecuteCopy.$inject = [];

    function _MicrocodeExecuteCopy() {
        var MEC;

        MEC = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEC.prototype = Object.create(AbstractMicrocode.prototype);
        MEC.prototype.constructor = MEC;

        MEC.prototype.finalizePropagationAndStoreResults = function () {
            var regOut, regIn0, regIn0Value;

            regOut = this.$$insDec.getRegOut();
            regIn0 = this.$$insDec.getRegIn0();
            regIn0Value = this.$$regFile.read(regIn0);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerExecuteCopy');
                Logger.log(3, 'regOut, regIn0 <-> ' + regOut + ', ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2) + " (COPY, save regIn0Value at regOut)");
            }
            
            this.$$regFile.save(regOut, regIn0Value);
            this.$$core.regClockTick = this.$$cc.getClockTickNext();
            this.$$core.regMemoryRowAddress = this.$$memCtrl.getMemoryRowAddress(this.$$regFile.getProgramCounter()); // TODO when instruction will save also to PC it will produce troubles in real circuit
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
        };

        return MEC;
    }

    return _MicrocodeExecuteCopy();        // TODO change it to dependency injection

})();
