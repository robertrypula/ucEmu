var SequencerExecuteLdSecond = (function () {
    'use strict';

    _SequencerExecuteLdSecond.$inject = [];

    function _SequencerExecuteLdSecond() {
        var SELS;

        SELS = function () {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SELS.prototype = Object.create(AbstractSequencerHandler.prototype);
        SELS.prototype.constructor = SELS;

        SELS.prototype.$$run = function () {
            var regIn0, regIn0Value, memoryColumn, shiftAmount,
                memoryReadShifted, regMANext;
            
            regIn0 = this.$$cpu.core.instructionDecoder.getRegIn0();
            regIn0Value = this.$$cpu.core.registerSet.read(regIn0);
            memoryColumn = BitUtils.mask(regIn0Value, BitUtils.BIT_2);
            shiftAmount = (4 - memoryColumn) * BitUtils.BYTE_1;
            memoryReadShifted = BitUtils.shiftRight(this.$$cpu.inputs.memoryRead, shiftAmount);
            regMANext = BitUtils.shiftRight(memoryReadShifted | this.$$cpu.registers.regMemory, BitUtils.BYTE_2);

            console.log('    :: sequencerExecuteLdSecond');
            console.log('    regIn0 = ' + regIn0);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    memoryColumn = ' + memoryColumn);
            console.log('    inputs.memoryRead = ' + dumpHex(this.$$cpu.inputs.memoryRead));
            console.log('    shiftAmount = ' + shiftAmount);
            console.log('    memoryReadShifted = ' + dumpHex(memoryReadShifted));
            console.log('    regMANext = ' + dumpHex(regMANext));

            this.$$cpu.core.registerSet.setMemoryAccess(regMANext);
            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATES.FETCH_FIRST;
        };

        return SELS;
    };

    return _SequencerExecuteLdSecond();        // TODO change it do dependency injection

})();
