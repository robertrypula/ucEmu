var SequencerExecuteLdFirst = (function () {
    'use strict';

    _SequencerExecuteLdFirst.$inject = [];

    function _SequencerExecuteLdFirst() {
        var SELF;

        SELF = function () {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SELF.prototype = Object.create(AbstractSequencerHandler.prototype);
        SELF.prototype.constructor = SELF;

        SELF.prototype.$$goToNextState = function () {
            var regIn0, regIn0Value, memoryColumn, memoryReadShifted;

            regIn0 = this.$$cpu.core.instructionDecoder.getRegIn0();
            regIn0Value = this.$$cpu.core.registerSet.read(regIn0);
            memoryColumn = BitUtils.mask(regIn0Value, BitUtils.BIT_2);
            memoryReadShifted = BitUtils.shiftLeft(this.$$cpu.inputs.memoryRead, memoryColumn * BitUtils.BYTE_1);

            console.log('    :: sequencerExecuteLdFirst');
            console.log('    regIn0 = ' + regIn0);
            console.log('    regIn0Value = ' + BitUtils.hex(regIn0Value, BitUtils.BYTE_2));
            console.log('    memoryColumn = ' + memoryColumn);
            console.log('    inputs.memoryRead = ' + BitUtils.hex(this.$$cpu.inputs.memoryRead, BitUtils.BYTE_4));
            console.log('    memoryReadShifted = ' + BitUtils.hex(memoryReadShifted, BitUtils.BYTE_4));

            this.$$cpu.registers.regMemory = memoryReadShifted;
            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATE.EXECUTE_LD_SECOND;
        };

        SELF.prototype.$$updateOutputMemoryRowAddress = function () {
            var regIn0, regIn0Value;

            regIn0 = this.$$cpu.core.instructionDecoder.getRegIn0();
            regIn0Value = this.$$cpu.core.registerSet.read(regIn0);

            this.$$cpu.outputs.memoryRowAddress = BitUtils.shiftRight(regIn0Value, BitUtils.BIT_2);
        };

        return SELF;
    }

    return _SequencerExecuteLdFirst();        // TODO change it do dependency injection

})();
