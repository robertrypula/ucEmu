var SequencerExecuteImm = (function () {
    'use strict';

    _SequencerExecuteImm.$inject = [];

    function _SequencerExecuteImm() {
        var SEI;

        SEI = function () {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SEI.prototype = Object.create(AbstractSequencerHandler.prototype);
        SEI.prototype.constructor = SEI;

        SEI.prototype.$$goToNextState = function () {
            var regOut, imm;

            regOut = this.$$cpu.core.instructionDecoder.getRegOut();
            imm = this.$$cpu.core.instructionDecoder.getImm();

            console.log('    :: sequencerExecuteImm');
            console.log('    regOut = ' + regOut);
            console.log('    imm = ' + dumpHex(imm) + " (store immediate value at regOut)");

            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATES.FETCH_FIRST;
            this.$$cpu.core.registerSet.save(regOut, imm);
        };

        return SEI;
    }

    return _SequencerExecuteImm();        // TODO change it do dependency injection

})();
