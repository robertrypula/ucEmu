var SequencerFetchFirst = (function () {
    'use strict';

    _SequencerFetchFirst.$inject = [];

    function _SequencerFetchFirst() {
        var DFF;

        DFF = function () {
            AbstractSequencerHandler.apply(this, arguments);
        };

        DFF.prototype = Object.create(AbstractSequencerHandler.prototype);
        DFF.prototype.constructor = DFF;

        DFF.prototype.$$run = function () {
            var memoryColumn, memoryReadShifted;

            memoryColumn = BitUtils.mask(this.$$cpu.core.registerSet.getProgramCounter(), BitUtils.BIT_2);
            memoryReadShifted = BitUtils.shiftLeft(this.$$cpu.inputs.memoryRead, memoryColumn * BitUtils.BYTE_1);

            console.log('    :: sequenceFetchFirst');
            console.log('    memoryColumn = ' + dumpHex(memoryColumn));
            console.log('    inputs.memoryRead = ' + dumpHex(this.$$cpu.inputs.memoryRead));
            console.log('    memoryReadShifted = ' + dumpHex(memoryReadShifted));

            this.$$cpu.registers.regMemory = memoryReadShifted;
            this.$$cpu.registers.regInstruction = memoryReadShifted;              // TODO check it, this may be redundant with regMemory
            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATES.FETCH_SECOND_AND_DECODE;
        };

        return DFF;
    }

    return _SequencerFetchFirst();        // TODO change it do dependency injection

})();
