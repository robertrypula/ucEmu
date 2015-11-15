var SequencerExecuteJnz = (function () {
    'use strict';

    _SequencerExecuteJnz.$inject = [];

    function _SequencerExecuteJnz() {
        var SEJ;

        SEJ = function (cpu) {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SEJ.prototype = Object.create(AbstractSequencerHandler.prototype);
        SEJ.prototype.constructor = SEJ;

        SEJ.prototype.$$goToNextState = function () {
            var regIn0, regIn1, regIn0Value, regIn1Value,
                notZeroFlag, regPCNext;

            regIn0 = this.$$cpu.core.instructionDecoder.getRegIn0();
            regIn1 = this.$$cpu.core.instructionDecoder.getRegIn1();
            regIn0Value = this.$$cpu.core.registerSet.read(regIn0);
            regIn1Value = this.$$cpu.core.registerSet.read(regIn1);
            notZeroFlag = regIn1Value !== 0;
            regPCNext = notZeroFlag ? regIn0Value : this.$$cpu.core.registerSet.getProgramCounter();

            Logger.log(2, ':: sequencerExecuteJnz');
            Logger.log(3, 'regIn0, regIn1 <-> ' + regIn0 + ', ' + regIn1);
            Logger.log(3, 'regIn0Value = ' + BitUtils.hex(regIn0Value, BitUtils.BYTE_2));
            Logger.log(3, 'regIn1Value = ' + BitUtils.hex(regIn1Value, BitUtils.BYTE_2));
            Logger.log(3, 'notZeroFlag = ' + (notZeroFlag ? "true (regIn1Value NOT EQUAL zero - jump)" : "false (regIn1Value EQUAL zero - no jump)"));
            Logger.log(3, 'regPCNext = ' + BitUtils.hex(regPCNext, BitUtils.BYTE_2));

            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATE.FETCH_FIRST;
            this.$$cpu.core.registerSet.setProgramCounter(regPCNext);
        };

        return SEJ;
    }

    return _SequencerExecuteJnz();        // TODO change it do dependency injection

})();
