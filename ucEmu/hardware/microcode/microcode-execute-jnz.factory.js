var MicrocodeExecuteJnz = (function () {
    'use strict';

    _MicrocodeExecuteJnz.$inject = [];

    function _MicrocodeExecuteJnz() {
        var MEJ;

        MEJ = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEJ.prototype = Object.create(AbstractMicrocode.prototype);
        MEJ.prototype.constructor = MEJ;

        MEJ.prototype.goToNextState = function () {
            var regIn0, regIn1, regIn0Value, regIn1Value,
                notZeroFlag, regPCNext;

            regIn0 = this.$$insDec.getRegIn0();
            regIn1 = this.$$insDec.getRegIn1();
            regIn0Value = this.$$regFile.read(regIn0);
            regIn1Value = this.$$regFile.read(regIn1);
            notZeroFlag = regIn1Value !== 0;
            regPCNext = notZeroFlag ? regIn0Value : this.$$regFile.getProgramCounter();

            if (Logger.isEnabled()) {
                Logger.log(2, '[ACTION] sequencerExecuteJnz');
                Logger.log(3, 'regIn0, regIn1 <-> ' + regIn0 + ', ' + regIn1);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2));
                Logger.log(3, 'regIn1Value = ' + BitUtil.hex(regIn1Value, BitUtil.BYTE_2));
                Logger.log(3, 'notZeroFlag = ' + (notZeroFlag ? "true (regIn1Value NOT EQUAL zero - jump)" : "false (regIn1Value EQUAL zero - no jump)"));
                Logger.log(3, 'regPCNext = ' + BitUtil.hex(regPCNext, BitUtil.BYTE_2));
            }

            this.$$regFile.setProgramCounter(regPCNext);
            this.$$core.regClockTick = this.$$cc.getClockTickNext();
            this.$$core.regMemoryRowAddress = this.$$memCtrl.getMemoryRowAddress(this.$$regFile.getProgramCounter()); // TODO when instruction will save also to PC it will produce troubles in real circuit 
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
        };

        return MEJ;
    }

    return _MicrocodeExecuteJnz();        // TODO change it to dependency injection

})();
