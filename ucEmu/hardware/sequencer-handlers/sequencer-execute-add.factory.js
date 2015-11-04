var SequencerExecuteAdd = (function () {
    'use strict';

     _SequencerExecuteAdd.$inject = [];

    function _SequencerExecuteAdd() {
        var SEA;

        SEA = function () {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SEA.prototype = Object.create(AbstractSequencerHandler.prototype);
        SEA.prototype.constructor = SEA;

        SEA.prototype.$$run = function () {
            var regOut, regIn0, regIn1,
                regIn0Value, regIn1Value, regResult;

            regOut = this.$$cpu.core.instructionDecoder.getRegOut();
            regIn0 = this.$$cpu.core.instructionDecoder.getRegIn0();
            regIn1 = this.$$cpu.core.instructionDecoder.getRegIn1();
            regIn0Value = this.$$cpu.core.registerSet.read(regIn0);
            regIn1Value = this.$$cpu.core.registerSet.read(regIn1);
            regResult = this.$$cpu.core.alu.add(regIn0Value, regIn1Value);

            console.log('    :: sequencerExecuteAdd');
            console.log('    regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    regIn1Value = ' + dumpHex(regIn1Value));
            console.log('    result = ' + dumpHex(regResult) + ' (sum)');

            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATES.FETCH_FIRST;
            this.$$cpu.core.registerSet.save(regOut, regResult);
        }

        return SEA;
    }

    return _SequencerExecuteAdd();        // TODO change it do dependency injection

})();
