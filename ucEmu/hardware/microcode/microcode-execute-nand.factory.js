var MicrocodeExecuteNand = (function () {
    'use strict';

    _MicrocodeExecuteNand.$inject = [];

    function _MicrocodeExecuteNand() {
        var MEN;

        MEN = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEN.prototype = Object.create(AbstractMicrocode.prototype);
        MEN.prototype.constructor = MEN;

        MEN.prototype.$$goToNextState = function () {
            var regOut, regIn0, regIn1,
                regIn0Value, regIn1Value, regResult;

            regOut = this.$$insDec.getRegOut();
            regIn0 = this.$$insDec.getRegIn0();
            regIn1 = this.$$insDec.getRegIn1();
            regIn0Value = this.$$regSet.read(regIn0);
            regIn1Value = this.$$regSet.read(regIn1);
            regResult = this.$$alu.nand(regIn0Value, regIn1Value);

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteNand');
                Logger.log(3, 'regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2));
                Logger.log(3, 'regIn1Value = ' + BitUtil.hex(regIn1Value, BitUtil.BYTE_2));
                Logger.log(3, 'result = ' + BitUtil.hex(regResult, BitUtil.BYTE_2) + ' (NAND)');
            }

            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
            this.$$regSet.save(regOut, regResult);
        };

        return MEN;
    }

    return _MicrocodeExecuteNand();        // TODO change it to dependency injection

})();
