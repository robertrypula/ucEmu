var MicrocodeExecuteLdSecond = (function () {
    'use strict';

    _MicrocodeExecuteLdSecond.$inject = [];

    function _MicrocodeExecuteLdSecond() {
        var MELS;

        MELS = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MELS.prototype = Object.create(AbstractMicrocode.prototype);
        MELS.prototype.constructor = MELS;

        MELS.prototype.$$goToNextState = function () {
            var regIn0, regIn0Value, column, columnFromTheBack,
                memoryReadShifted, memoryReadFinal;
            
            regIn0 = this.$$insDec.getRegIn0();
            regIn0Value = this.$$regSet.read(regIn0);
            column = this.$$mc.getColumn(regIn0Value);
            columnFromTheBack = this.$$mc.getColumnFromTheBack(column);
            memoryReadShifted = this.$$mc.getMemoryReadShiftedRight(columnFromTheBack);
            memoryReadFinal = this.$$mc.getMemoryReadFinal(memoryReadShifted);

            if (Logger.isEnabled()) {
                Logger.log(2, '[ACTION] sequencerExecuteLdSecond');
                Logger.log(3, 'regIn0 = ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2));
                Logger.log(3, 'column = ' + column);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(this.$$in.memoryRead, BitUtil.BYTE_4));
                Logger.log(3, 'columnFromTheBack = ' + columnFromTheBack);
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitUtil.BYTE_4));
                Logger.log(3, 'memoryReadFinal = ' + BitUtil.hex(memoryReadFinal, BitUtil.BYTE_2));
            }

            this.$$regSet.setMemoryAccess(memoryReadFinal);
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
        };

        MELS.prototype.$$updateOutputMemoryRowAddress = function () {
            var regIn0, regIn0Value;

            regIn0 = this.$$insDec.getRegIn0();
            regIn0Value = this.$$regSet.read(regIn0);

            this.$$out.memoryRowAddress = this.$$mc.getMemoryRowAddressNext(regIn0Value);
        };

        return MELS;
    };

    return _MicrocodeExecuteLdSecond();        // TODO change it to dependency injection

})();
