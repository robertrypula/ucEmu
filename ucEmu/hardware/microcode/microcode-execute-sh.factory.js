var MicrocodeExecuteSh = (function () {
    'use strict';

    _MicrocodeExecuteSh.$inject = [];

    function _MicrocodeExecuteSh() {
        var MES;

        MES = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MES.prototype = Object.create(AbstractMicrocode.prototype);
        MES.prototype.constructor = MES;

        MES.prototype.finalizePropagationAndStoreResults = function () {
            var regOut, regIn0, regIn1, 
                regIn0Value, regIn1Value, regResult;

            regOut = this.$$insDec.getRegOut();
            regIn0 = this.$$insDec.getRegIn0();
            regIn1 = this.$$insDec.getRegIn1();
            regIn0Value = this.$$regFile.read(regIn0);
            regIn1Value = this.$$regFile.read(regIn1);
            regResult = this.$$alu.sh(regIn0Value, regIn1Value);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerExecuteSh');
                Logger.log(3, 'regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2));
                Logger.log(3, 'regIn1Value = ' + BitUtil.hex(regIn1Value, BitUtil.BYTE_2));
                Logger.log(3, 'result = ' + BitUtil.hex(regResult, BitUtil.BYTE_2) + ' (BIT SHIFT)');
            }

            this.$$regFile.save(regOut, regResult);
            this.$$core.regClockTick = this.$$cc.getClockTickNext();
            this.$$core.regMemoryRowAddress = this.$$memCtrl.getMemoryRowAddress(this.$$regFile.getProgramCounter()); // TODO when instruction will save also to PC it will produce troubles in real circuit
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
        };

        return MES;
    }

    return _MicrocodeExecuteSh();        // TODO change it to dependency injection

})();
