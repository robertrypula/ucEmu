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

            memoryColumn = BitUtils.mask(this.$$regSet.getProgramCounter(), BitUtils.BIT_2);
            memoryReadShifted = BitUtils.shiftLeft(this.$$in.memoryRead, memoryColumn * BitUtils.BYTE_1);

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequenceFetchFirst');
                Logger.log(3, 'memoryColumn = ' + memoryColumn);
                Logger.log(3, 'inputs.memoryRead = ' + BitUtils.hex(this.$$in.memoryRead, BitUtils.BYTE_4));
                Logger.log(3, 'memoryReadShifted = ' + BitUtils.hex(memoryReadShifted, BitUtils.BYTE_4));
            }

            this.$$reg.regMemory = memoryReadShifted;
            this.$$reg.regInstruction = memoryReadShifted;              // TODO check it, this may be redundant with regMemory
            this.$$reg.regSequencer = this.$$MICROCODE.FETCH_SECOND_AND_DECODE;
        };

        return MFF;
    }

    return _MicrocodeFetchFirst();        // TODO change it to dependency injection

})();
