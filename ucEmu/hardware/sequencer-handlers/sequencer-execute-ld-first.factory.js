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

        SELF.prototype.$$run = function () {
            var regIn0, regIn0Value, memoryColumn, memoryReadShifted;

            regIn0 = this.$$cpu.core.instructionDecoder.getRegIn0();
            regIn0Value = this.$$cpu.core.registerSet.read(regIn0);
            memoryColumn = BitUtils.mask(regIn0Value, BitUtils.BIT_2);
            memoryReadShifted = BitUtils.shiftLeft(this.$$cpu.inputs.memoryRead, memoryColumn * BitUtils.BYTE_1);

            console.log('    :: sequencerExecuteLdFirst');
            console.log('    regIn0 = ' + regIn0);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    memoryColumn = ' + dumpHex(memoryColumn));
            console.log('    inputs.memoryRead = ' + dumpHex(this.$$cpu.inputs.memoryRead));
            console.log('    memoryReadShifted = ' + dumpHex(memoryReadShifted));

            this.$$cpu.registers.regMemory = memoryReadShifted;
            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATES.EXECUTE_LD_SECOND;
        };

        return SELF;
    }

    return _SequencerExecuteLdFirst();        // TODO change it do dependency injection

})();
