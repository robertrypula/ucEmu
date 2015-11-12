var SequencerFetchFirst = (function () {
    'use strict';

    _SequencerFetchFirst.$inject = [];

    function _SequencerFetchFirst() {
        var SFF;

        SFF = function () {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SFF.prototype = Object.create(AbstractSequencerHandler.prototype);
        SFF.prototype.constructor = SFF;

        SFF.prototype.$$goToNextState = function () {
            var memoryColumn, memoryReadShifted;

            memoryColumn = BitUtils.mask(this.$$cpu.core.registerSet.getProgramCounter(), BitUtils.BIT_2);
            memoryReadShifted = BitUtils.shiftLeft(this.$$cpu.inputs.memoryRead, memoryColumn * BitUtils.BYTE_1);

            console.log('    :: sequenceFetchFirst');
            console.log('    memoryColumn = ' + memoryColumn);
            console.log('    inputs.memoryRead = ' + BitUtils.hex(this.$$cpu.inputs.memoryRead, BitUtils.BYTE_4));
            console.log('    memoryReadShifted = ' + BitUtils.hex(memoryReadShifted, BitUtils.BYTE_4));

            this.$$cpu.registers.regMemory = memoryReadShifted;
            this.$$cpu.registers.regInstruction = memoryReadShifted;              // TODO check it, this may be redundant with regMemory
            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATES.FETCH_SECOND_AND_DECODE;
        };

        SFF.prototype.$$updateOutputMemoryRowAddress = function () {
            this.$$cpu.outputs.memoryRowAddress = BitUtils.shiftRight(this.$$cpu.core.registerSet.getProgramCounter(), BitUtils.BIT_2);
        };

        return SFF;
    }

    return _SequencerFetchFirst();        // TODO change it do dependency injection

})();
