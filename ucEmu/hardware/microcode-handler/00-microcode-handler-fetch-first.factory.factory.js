var MicrocodeHandlerFetchFirst = (function () {
    'use strict';

    _MicrocodeHandlerFetchFirst.$inject = [];

    function _MicrocodeHandlerFetchFirst() {
        var MFF;

        MFF = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MFF.prototype = Object.create(AbstractMicrocode.prototype);
        MFF.prototype.constructor = MFF;

        MFF.prototype.finalizePropagationAndStoreResults = function () {
            var column, memoryReadShifted;
            
            column = MemoryController.getColumn(this.$$regFile.getProgramCounter());
            memoryReadShifted = MemoryController.getMemoryReadShiftedLeft(this.$$in.memoryRead, column);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequenceFetchFirst');
                Logger.log(3, 'column = ' + column);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(this.$$in.memoryRead, BitUtil.BYTE_4));
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitUtil.BYTE_4));
            }

            this.$$core.regClockTick = ClockTick.getClockTickNext(this.$$core.regClockTick);
            this.$$core.regMemoryBuffer = memoryReadShifted;
            this.$$core.regMemoryRowAddress = MemoryController.getMemoryRowAddressNextRow(this.$$regFile.getProgramCounter());
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_SECOND_AND_DECODE;
            this.$$core.regInstruction = memoryReadShifted;
        };

        return MFF;
    }

    return _MicrocodeHandlerFetchFirst();        // TODO change it to dependency injection

})();
