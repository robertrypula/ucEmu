var MicrocodeExecuteJnz = (function () {
    'use strict';

    _MicrocodeExecuteJnz.$inject = [];

    function _MicrocodeExecuteJnz() {
        var MEJ;

        MEJ = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEJ.prototype = Object.create(AbstractMicrocode.prototype);
        MEJ.prototype.constructor = MEJ;

        MEJ.prototype.$$goToNextState = function () {
            var regIn0, regIn1, regIn0Value, regIn1Value,
                notZeroFlag, regPCNext;

            regIn0 = this.$$insDec.getRegIn0();
            regIn1 = this.$$insDec.getRegIn1();
            regIn0Value = this.$$regSet.read(regIn0);
            regIn1Value = this.$$regSet.read(regIn1);
            notZeroFlag = regIn1Value !== 0;
            regPCNext = notZeroFlag ? regIn0Value : this.$$regSet.getProgramCounter();

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteJnz');
                Logger.log(3, 'regIn0, regIn1 <-> ' + regIn0 + ', ' + regIn1);
                Logger.log(3, 'regIn0Value = ' + BitUtils.hex(regIn0Value, BitUtils.BYTE_2));
                Logger.log(3, 'regIn1Value = ' + BitUtils.hex(regIn1Value, BitUtils.BYTE_2));
                Logger.log(3, 'notZeroFlag = ' + (notZeroFlag ? "true (regIn1Value NOT EQUAL zero - jump)" : "false (regIn1Value EQUAL zero - no jump)"));
                Logger.log(3, 'regPCNext = ' + BitUtils.hex(regPCNext, BitUtils.BYTE_2));
            }

            this.$$reg.regSequencer = this.$$MICROCODE.FETCH_FIRST;
            this.$$regSet.setProgramCounter(regPCNext);
        };

        return MEJ;
    }

    return _MicrocodeExecuteJnz();        // TODO change it do dependency injection

})();
