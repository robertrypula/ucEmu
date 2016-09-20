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

        MES.prototype.$$goToNextState = function () {
            var regOut, regIn0, regIn1, 
                regIn0Value, regIn1Value, regResult;

            regOut = this.$$insDec.getRegOut();
            regIn0 = this.$$insDec.getRegIn0();
            regIn1 = this.$$insDec.getRegIn1();
            regIn0Value = this.$$regSet.read(regIn0);
            regIn1Value = this.$$regSet.read(regIn1);
            regResult = this.$$alu.sh(regIn0Value, regIn1Value);

            if (Logger.isEnabled()) {
                Logger.log(2, '[ACTION] sequencerExecuteSh');
                Logger.log(3, 'regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2));
                Logger.log(3, 'regIn1Value = ' + BitUtil.hex(regIn1Value, BitUtil.BYTE_2));
                Logger.log(3, 'result = ' + BitUtil.hex(regResult, BitUtil.BYTE_2) + ' (BIT SHIFT)');
            }

            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
            this.$$regSet.save(regOut, regResult);
        };

        return MES;
    }

    return _MicrocodeExecuteSh();        // TODO change it to dependency injection

})();
