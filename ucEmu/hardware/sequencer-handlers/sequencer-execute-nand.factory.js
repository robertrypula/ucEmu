var SequencerExecuteNand = (function () {
    'use strict';

    _SequencerExecuteNand.$inject = [];

    function _SequencerExecuteNand() {
        var SEN;

        SEN = function (cpu) {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SEN.prototype = Object.create(AbstractSequencerHandler.prototype);
        SEN.prototype.constructor = SEN;

        SEN.prototype.$$goToNextState = function () {
            var regOut, regIn0, regIn1,
                regIn0Value, regIn1Value, regResult;

            regOut = this.$$cpu.core.instructionDecoder.getRegOut();
            regIn0 = this.$$cpu.core.instructionDecoder.getRegIn0();
            regIn1 = this.$$cpu.core.instructionDecoder.getRegIn1();
            regIn0Value = this.$$cpu.core.registerSet.read(regIn0);
            regIn1Value = this.$$cpu.core.registerSet.read(regIn1);
            regResult = this.$$cpu.core.alu.nand(regIn0Value, regIn1Value);

            Logger.log(':: sequencerExecuteNand');
            Logger.log('regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
            Logger.log('regIn0Value = ' + BitUtils.hex(regIn0Value, BitUtils.BYTE_2));
            Logger.log('regIn1Value = ' + BitUtils.hex(regIn1Value, BitUtils.BYTE_2));
            Logger.log('result = ' + BitUtils.hex(regResult, BitUtils.BYTE_2) + ' (NAND)');

            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATE.FETCH_FIRST;
            this.$$cpu.core.registerSet.save(regOut, regResult);
        };

        return SEN;
    }

    return _SequencerExecuteNand();        // TODO change it do dependency injection

})();
