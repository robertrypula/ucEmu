var SequencerExecuteAdd = (function () {
    'use strict';

     _SequencerExecuteAdd.$inject = [];

    function _SequencerExecuteAdd() {
        var SEA;

        SEA = function (cpu) {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SEA.prototype = Object.create(AbstractSequencerHandler.prototype);
        SEA.prototype.constructor = SEA;

        SEA.prototype.$$goToNextState = function () {
            var regOut, regIn0, regIn1,
                regIn0Value, regIn1Value, regResult;

            regOut = this.$$insDec.getRegOut();
            regIn0 = this.$$insDec.getRegIn0();
            regIn1 = this.$$insDec.getRegIn1();
            regIn0Value = this.$$regSet.read(regIn0);
            regIn1Value = this.$$regSet.read(regIn1);
            regResult = this.$$alu.add(regIn0Value, regIn1Value);

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteAdd');
                Logger.log(3, 'regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
                Logger.log(3, 'regIn0Value = ' + BitUtils.hex(regIn0Value, BitUtils.BYTE_2));
                Logger.log(3, 'regIn1Value = ' + BitUtils.hex(regIn1Value, BitUtils.BYTE_2));
                Logger.log(3, 'result = ' + BitUtils.hex(regResult, BitUtils.BYTE_2) + ' (sum)');
            }

            this.$$reg.regSequencer = this.$$MICROCODE.FETCH_FIRST;
            this.$$regSet.save(regOut, regResult);
        };

        return SEA;
    }

    return _SequencerExecuteAdd();        // TODO change it do dependency injection

})();
