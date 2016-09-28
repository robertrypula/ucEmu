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
            
            regIn0 = InstructionDecoder.getRegIn0(this.$$core.regInstruction);
            regIn0Value = this.$$regFile.read(regIn0);
            column = MemoryController.getColumn(regIn0Value);
            columnFromTheBack = MemoryController.getColumnFromTheBack(column);
            memoryReadShifted = MemoryController.getMemoryReadShiftedRight(columnFromTheBack);
            memoryReadFinal = MemoryController.getMemoryReadFinal(memoryReadShifted, this.$$core.regMemoryBuffer);

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
            this.$$core.regClockTick = ClockTick.getClockTickNext(this.$$core.regClockTick);
            this.$$core.regMemoryRowAddress = MemoryController.getMemoryRowAddress(this.$$regFile.getProgramCounter()); // TODO when instruction will save also to PC it will produce troubles in real circuit
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
        };

        return MELS;
    }

    return _MicrocodeHandlerLdSecond();        // TODO change it to dependency injection

})();
