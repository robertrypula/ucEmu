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
            var regIn0, regIn0Value, memoryColumn, shiftAmount,
                memoryReadShifted, regMANext;
            
            regIn0 = this.$$insDec.getRegIn0();
            regIn0Value = this.$$regSet.read(regIn0);
            memoryColumn = BitUtil.mask(regIn0Value, BitUtil.BIT_2);
            shiftAmount = (4 - memoryColumn) * BitUtil.BYTE_1;
            memoryReadShifted = BitUtil.shiftRight(this.$$in.memoryRead, shiftAmount);
            regMANext = BitUtil.shiftRight(memoryReadShifted | this.$$core.regMemory, BitUtil.BYTE_2);

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteLdSecond');
                Logger.log(3, 'regIn0 = ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2));
                Logger.log(3, 'memoryColumn = ' + memoryColumn);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(this.$$in.memoryRead, BitUtil.BYTE_4));
                Logger.log(3, 'shiftAmount = ' + shiftAmount);
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitUtil.BYTE_4));
                Logger.log(3, 'regMANext = ' + BitUtil.hex(regMANext, BitUtil.BYTE_2));
            }

            this.$$regSet.setMemoryAccess(regMANext);
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
        };

        MELS.prototype.$$updateOutputMemoryRowAddress = function () {
            var regIn0, regIn0Value;

            regIn0 = this.$$insDec.getRegIn0();
            regIn0Value = this.$$regSet.read(regIn0);

            this.$$out.memoryRowAddress = BitUtil.shiftRight(regIn0Value, BitUtil.BIT_2) + 1;
        };

        return MELS;
    };

    return _MicrocodeExecuteLdSecond();        // TODO change it to dependency injection

})();
