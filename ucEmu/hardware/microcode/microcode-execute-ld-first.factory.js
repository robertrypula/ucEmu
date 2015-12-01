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
            var regIn0, regIn0Value, memoryColumn, memoryReadShifted;

            regIn0 = this.$$insDec.getRegIn0();
            regIn0Value = this.$$regSet.read(regIn0);
            memoryColumn = BitUtils.mask(regIn0Value, BitUtils.BIT_2);
            memoryReadShifted = BitUtils.shiftLeft(this.$$in.memoryRead, memoryColumn * BitUtils.BYTE_1);

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteLdFirst');
                Logger.log(3, 'regIn0 = ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtils.hex(regIn0Value, BitUtils.BYTE_2));
                Logger.log(3, 'memoryColumn = ' + memoryColumn);
                Logger.log(3, 'input.memoryRead = ' + BitUtils.hex(this.$$in.memoryRead, BitUtils.BYTE_4));
                Logger.log(3, 'memoryReadShifted = ' + BitUtils.hex(memoryReadShifted, BitUtils.BYTE_4));
            }

            this.$$core.regMemory = memoryReadShifted;
            this.$$core.regSequencer = this.$$MICROCODE.EXECUTE_LD_SECOND;
        };

        MELF.prototype.$$updateOutputMemoryRowAddress = function () {
            var regIn0, regIn0Value;

            regIn0 = this.$$insDec.getRegIn0();
            regIn0Value = this.$$regSet.read(regIn0);

            this.$$out.memoryRowAddress = BitUtils.shiftRight(regIn0Value, BitUtils.BIT_2);
        };

        return MELF;
    }

    return _MicrocodeExecuteLdFirst();        // TODO change it to dependency injection

})();
