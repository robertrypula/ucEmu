var MicrocodeHandlerImm = (function () {
    'use strict';

    _MicrocodeHandlerImm.$inject = [];

    function _MicrocodeHandlerImm() {
        var MEI;

        MEI = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEI.prototype = Object.create(AbstractMicrocode.prototype);
        MEI.prototype.constructor = MEI;

        MEI.prototype.finalizePropagationAndStoreResults = function () {
            var regOut, imm;

            regOut = this.$$insDec.getRegOut();
            imm = this.$$insDec.getImm();

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerImm');
                Logger.log(3, 'regOut = ' + regOut);
                Logger.log(3, 'imm = ' + BitUtil.hex(imm, BitUtil.BYTE_2) + " (store immediate value at regOut)");
            }
            
            this.$$regFile.save(regOut, imm);
            this.$$core.regClockTick = this.$$cc.getClockTickNext();
            this.$$core.regMemoryRowAddress = this.$$memCtrl.getMemoryRowAddress(this.$$regFile.getProgramCounter()); // TODO when instruction will save also to PC it will produce troubles in real circuit
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
        };

        return MEI;
    }

    return _MicrocodeHandlerImm();        // TODO change it to dependency injection

})();
