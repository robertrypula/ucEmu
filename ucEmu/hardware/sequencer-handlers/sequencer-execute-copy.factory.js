var SequencerExecuteCopy = (function () {
    'use strict';

    _SequencerExecuteCopy.$inject = [];

    function _SequencerExecuteCopy() {
        var SEC;

        SEC = function (cpu) {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SEC.prototype = Object.create(AbstractSequencerHandler.prototype);
        SEC.prototype.constructor = SEC;

        SEC.prototype.$$goToNextState = function () {
            var regOut, regIn0, regIn0Value;

            regOut = this.$$cpu.core.instructionDecoder.getRegOut();
            regIn0 = this.$$cpu.core.instructionDecoder.getRegIn0();
            regIn0Value = this.$$cpu.core.registerSet.read(regIn0);

            Logger.log(2, ':: sequencerExecuteCopy');
            Logger.log(3, 'regOut, regIn0 <-> ' + regOut + ', ' + regIn0);
            Logger.log(3, 'regIn0Value = ' + BitUtils.hex(regIn0Value, BitUtils.BYTE_2) + " (COPY, save regIn0Value at regOut)");

            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATE.FETCH_FIRST;
            this.$$cpu.core.registerSet.save(regOut, regIn0Value);
        };

        return SEC;
    }

    return _SequencerExecuteCopy();        // TODO change it do dependency injection

})();
