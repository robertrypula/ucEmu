var SequencerExecuteJnz = (function () {
    'use strict';

    _SequencerExecuteJnz.$inject = [];

    function _SequencerExecuteJnz() {
        var SEJ;

        SEJ = function () {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SEJ.prototype = Object.create(AbstractSequencerHandler.prototype);
        SEJ.prototype.constructor = SEJ;

        SEJ.prototype.$$run = function () {
            var regIn0, regIn1, regIn0Value, regIn1Value,
                notZeroFlag, regPCNext;

            regIn0 = this.$$cpu.core.instructionDecoder.getRegIn0();
            regIn1 = this.$$cpu.core.instructionDecoder.getRegIn1();
            regIn0Value = this.$$cpu.core.registerSet.read(regIn0);
            regIn1Value = this.$$cpu.core.registerSet.read(regIn1);
            notZeroFlag = regIn1Value !== 0;
            regPCNext = notZeroFlag ? regIn0Value : this.$$cpu.core.registerSet.getProgramCounter();

            console.log('    :: sequencerExecuteJnz');
            console.log('    regIn0, regIn1 <-> ' + regIn0 + ', ' + regIn1);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    regIn1Value = ' + dumpHex(regIn1Value));
            console.log('    notZeroFlag = ' + (notZeroFlag ? "true (regIn1Value NOT EQUAL zero - jump)" : "false (regIn1Value EQUAL zero - no jump)"));
            console.log('    regPCNext = ' + dumpHex(regPCNext));

            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATES.FETCH_FIRST;
            this.$$cpu.core.registerSet.setProgramCounter(regPCNext);
        };

        return SEJ;
    }

    return _SequencerExecuteJnz();        // TODO change it do dependency injection

})();
