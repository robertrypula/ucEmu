var MicrocodeExecuteLdFirst = (function () {
    'use strict';

    _MicrocodeExecuteLdFirst.$inject = [];

    function _MicrocodeExecuteLdFirst() {
        var MELF;

        MELF = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MELF.prototype = Object.create(AbstractMicrocode.prototype);
        MELF.prototype.constructor = MELF;

        MELF.prototype.$$goToNextState = function () {
            var regIn0, regIn0Value, column, memoryReadShifted;

            regIn0 = this.$$insDec.getRegIn0();
            regIn0Value = this.$$regFile.read(regIn0);
            column = this.$$mc.getColumn(regIn0Value);
            memoryReadShifted = this.$$mc.getMemoryReadShiftedLeft(column);

            if (Logger.isEnabled()) {
                Logger.log(2, '[ACTION] sequencerExecuteLdFirst');
                Logger.log(3, 'regIn0 = ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2));
                Logger.log(3, 'column = ' + column);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(this.$$in.memoryRead, BitUtil.BYTE_4));
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitUtil.BYTE_4));
            }

            this.$$core.regMemoryBuffer = memoryReadShifted;
            this.$$core.regSequencer = this.$$MICROCODE.EXECUTE_LD_SECOND;
        };

        MELF.prototype.$$updateOutputMemoryRowAddress = function () {
            var regIn0, regIn0Value;

            regIn0 = this.$$insDec.getRegIn0();
            regIn0Value = this.$$regFile.read(regIn0);

            this.$$out.memoryRowAddress = this.$$mc.getMemoryRowAddress(regIn0Value);
        };

        return MELF;
    }

    return _MicrocodeExecuteLdFirst();        // TODO change it to dependency injection

})();
