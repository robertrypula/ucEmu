var MicrocodeHandlerLdSecond = (function () {
    'use strict';

    _MicrocodeHandlerLdSecond.$inject = [];

    function _MicrocodeHandlerLdSecond() {
        var MELS;

        MELS = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MELS.prototype = Object.create(AbstractMicrocode.prototype);
        MELS.prototype.constructor = MELS;

        MELS.prototype.finalizePropagationAndStoreResults = function () {
            var regIn0, regIn0Value, column, columnFromTheBack,
                memoryReadShifted, memoryReadFinal;
            
            regIn0 = this.$$insDec.getRegIn0();
            regIn0Value = this.$$regFile.read(regIn0);
            column = this.$$memCtrl.getColumn(regIn0Value);
            columnFromTheBack = this.$$memCtrl.getColumnFromTheBack(column);
            memoryReadShifted = this.$$memCtrl.getMemoryReadShiftedRight(columnFromTheBack);
            memoryReadFinal = this.$$memCtrl.getMemoryReadFinal(memoryReadShifted);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerLdSecond');
                Logger.log(3, 'regIn0 = ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2));
                Logger.log(3, 'column = ' + column);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(this.$$in.memoryRead, BitUtil.BYTE_4));
                Logger.log(3, 'columnFromTheBack = ' + columnFromTheBack);
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitUtil.BYTE_4));
                Logger.log(3, 'memoryReadFinal = ' + BitUtil.hex(memoryReadFinal, BitUtil.BYTE_2));
            }

            this.$$regFile.setMemoryAccess(memoryReadFinal);       // it could be at some point any register...
            this.$$core.regClockTick = this.$$cc.getClockTickNext();
            this.$$core.regMemoryRowAddress = this.$$memCtrl.getMemoryRowAddress(this.$$regFile.getProgramCounter()); // TODO when instruction will save also to PC it will produce troubles in real circuit
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
        };

        return MELS;
    }

    return _MicrocodeHandlerLdSecond();        // TODO change it to dependency injection

})();
