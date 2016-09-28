var MicrocodeHandlerLdFirst = (function () {
    'use strict';

    _MicrocodeHandlerLdFirst.$inject = [];

    function _MicrocodeHandlerLdFirst() {
        var MELF;

        MELF = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MELF.prototype = Object.create(AbstractMicrocode.prototype);
        MELF.prototype.constructor = MELF;

        MELF.prototype.finalizePropagationAndStoreResults = function () {
            var regIn0, regIn0Value, column, memoryReadShifted;

            regIn0 = InstructionDecoder.getRegIn0(this.$$core.regInstruction);
            regIn0Value = this.$$regFile.read(regIn0);
            column = MemoryController.getColumn(regIn0Value);
            memoryReadShifted = MemoryController.getMemoryReadShiftedLeft(this.$$in.memoryRead, column);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerLdFirst');
                Logger.log(3, 'regIn0 = ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2));
                Logger.log(3, 'column = ' + column);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(this.$$in.memoryRead, BitUtil.BYTE_4));
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitUtil.BYTE_4));
            }

            this.$$core.regClockTick = ClockTick.getClockTickNext(this.$$core.regClockTick);
            this.$$core.regMemoryBuffer = memoryReadShifted;
            this.$$core.regMemoryRowAddress = MemoryController.getMemoryRowAddressNextRow(regIn0Value);
            this.$$core.regSequencer = this.$$MICROCODE.LD_SECOND;
        };

        return MELF;
    }

    return _MicrocodeHandlerLdFirst();        // TODO change it to dependency injection

})();
