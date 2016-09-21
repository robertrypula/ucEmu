var MicrocodeExecuteImm = (function () {
    'use strict';

    _MicrocodeExecuteImm.$inject = [];

    function _MicrocodeExecuteImm() {
        var MEI;

        MEI = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEI.prototype = Object.create(AbstractMicrocode.prototype);
        MEI.prototype.constructor = MEI;

        MEI.prototype.$$goToNextState = function () {
            var regOut, imm;

            regOut = this.$$insDec.getRegOut();
            imm = this.$$insDec.getImm();

            if (Logger.isEnabled()) {
                Logger.log(2, '[ACTION] sequencerExecuteImm');
                Logger.log(3, 'regOut = ' + regOut);
                Logger.log(3, 'imm = ' + BitUtil.hex(imm, BitUtil.BYTE_2) + " (store immediate value at regOut)");
            }

            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
            this.$$regFile.save(regOut, imm);
        };

        return MEI;
    }

    return _MicrocodeExecuteImm();        // TODO change it to dependency injection

})();
