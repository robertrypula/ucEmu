var SequencerExecuteImm = (function () {
    'use strict';

    _SequencerExecuteImm.$inject = [];

    function _SequencerExecuteImm() {
        var SEI;

        SEI = function (cpu) {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SEI.prototype = Object.create(AbstractSequencerHandler.prototype);
        SEI.prototype.constructor = SEI;

        SEI.prototype.$$goToNextState = function () {
            var regOut, imm;

            regOut = this.$$insDec.getRegOut();
            imm = this.$$insDec.getImm();

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteImm');
                Logger.log(3, 'regOut = ' + regOut);
                Logger.log(3, 'imm = ' + BitUtils.hex(imm, BitUtils.BYTE_2) + " (store immediate value at regOut)");
            }

            this.$$reg.regSequencer = this.$$seqSTATE.FETCH_FIRST;
            this.$$regSet.save(regOut, imm);
        };

        return SEI;
    }

    return _SequencerExecuteImm();        // TODO change it do dependency injection

})();
