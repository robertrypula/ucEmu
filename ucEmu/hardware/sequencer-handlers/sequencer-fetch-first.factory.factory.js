var SequencerFetchFirst = (function () {
    'use strict';

    _SequencerFetchFirst.$inject = [];

    function _SequencerFetchFirst() {
        var SFF;

        SFF = function (cpu) {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SFF.prototype = Object.create(AbstractSequencerHandler.prototype);
        SFF.prototype.constructor = SFF;

        SFF.prototype.$$goToNextState = function () {
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
            this.$$reg.regSequencer = this.$$seqSTATE.FETCH_SECOND_AND_DECODE;
        };

        SFF.prototype.$$updateOutputMemoryRowAddress = function () {
            this.$$out.memoryRowAddress = BitUtils.shiftRight(this.$$regSet.getProgramCounter(), BitUtils.BIT_2);
        };

        return SFF;
    }

    return _SequencerFetchFirst();        // TODO change it do dependency injection

})();
