var MicrocodeFetchFirst = (function () {
    'use strict';

    _MicrocodeFetchFirst.$inject = [];

    function _MicrocodeFetchFirst() {
        var MFF;

        MFF = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MFF.prototype = Object.create(AbstractMicrocode.prototype);
        MFF.prototype.constructor = MFF;

        MFF.prototype.$$goToNextState = function () {
            var memoryColumn, memoryReadShifted;

            memoryColumn = this.$$mc.getColumn(this.$$regSet.getProgramCounter());
            memoryReadShifted = this.$$mc.getMemoryReadShiftedLeft(memoryColumn);

            if (Logger.isEnabled()) {
                Logger.log(2, '[ACTION] sequenceFetchFirst');
                Logger.log(3, 'memoryColumn = ' + memoryColumn);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(this.$$in.memoryRead, BitUtil.BYTE_4));
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitUtil.BYTE_4));
            }

            this.$$core.regRamBuffer = memoryReadShifted;
            this.$$core.regInstruction = memoryReadShifted;  // TODO check it, this may be redundant with regRamBuffer
                                                             // UPDATE maybe not because first part allows to read instruction opcode
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_SECOND_AND_DECODE;
        };

        return MFF;
    }

    return _MicrocodeFetchFirst();        // TODO change it to dependency injection

})();
