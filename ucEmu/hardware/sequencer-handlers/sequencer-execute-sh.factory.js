var SequencerExecuteSh = (function () {
    'use strict';

    _SequencerExecuteSh.$inject = [];

    function _SequencerExecuteSh() {
        var SES;

        SES = function () {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SES.prototype = Object.create(AbstractSequencerHandler.prototype);
        SES.prototype.constructor = SES;

        SES.prototype.$$goToNextState = function () {
            var regOut, regIn0, regIn1, 
                regIn0Value, regIn1Value, regResult;

            regOut = this.$$cpu.core.instructionDecoder.getRegOut();
            regIn0 = this.$$cpu.core.instructionDecoder.getRegIn0();
            regIn1 = this.$$cpu.core.instructionDecoder.getRegIn1();
            regIn0Value = this.$$cpu.core.registerSet.read(regIn0);
            regIn1Value = this.$$cpu.core.registerSet.read(regIn1);
            regResult = this.$$cpu.core.alu.sh(regIn0Value, regIn1Value);

            console.log('    :: sequencerExecuteSh');
            console.log('    regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
            console.log('    regIn0Value = ' + BitUtils.hex(regIn0Value, BitUtils.BYTE_2));
            console.log('    regIn1Value = ' + BitUtils.hex(regIn1Value, BitUtils.BYTE_2));
            console.log('    result = ' + BitUtils.hex(regResult, BitUtils.BYTE_2) + ' (BIT SHIFT)');

            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATE.FETCH_FIRST;
            this.$$cpu.core.registerSet.save(regOut, regResult);
        };

        return SES;
    }

    return _SequencerExecuteSh();        // TODO change it do dependency injection

})();
