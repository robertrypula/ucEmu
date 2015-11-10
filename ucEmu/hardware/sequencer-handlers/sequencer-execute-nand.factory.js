var SequencerExecuteNand = (function () {
    'use strict';

    _SequencerExecuteNand.$inject = [];

    function _SequencerExecuteNand() {
        var SEN;

        SEN = function () {
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

            console.log('    :: sequencerExecuteNand');
            console.log('    regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    regIn1Value = ' + dumpHex(regIn1Value));
            console.log('    result = ' + dumpHex(regResult) + ' (NAND)');

            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATES.FETCH_FIRST;
            this.$$cpu.core.registerSet.save(regOut, regResult);
        };

        return SEN;
    }

    return _SequencerExecuteNand();        // TODO change it do dependency injection

})();
