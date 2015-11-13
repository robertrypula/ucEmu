var SequencerExecuteLdSecond = (function () {
    'use strict';

    _SequencerExecuteLdSecond.$inject = [];

    function _SequencerExecuteLdSecond() {
        var SELS;

        SELS = function (cpu) {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SELS.prototype = Object.create(AbstractSequencerHandler.prototype);
        SELS.prototype.constructor = SELS;

        SELS.prototype.$$goToNextState = function () {
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
            console.log('    regIn0Value = ' + BitUtils.hex(regIn0Value, BitUtils.BYTE_2));
            console.log('    memoryColumn = ' + memoryColumn);
            console.log('    inputs.memoryRead = ' + BitUtils.hex(this.$$cpu.inputs.memoryRead, BitUtils.BYTE_4));
            console.log('    shiftAmount = ' + shiftAmount);
            console.log('    memoryReadShifted = ' + BitUtils.hex(memoryReadShifted, BitUtils.BYTE_4));
            console.log('    regMANext = ' + BitUtils.hex(regMANext, BitUtils.BYTE_2));

            this.$$cpu.core.registerSet.setMemoryAccess(regMANext);
            this.$$cpu.registers.regSequencer = this.$$cpu.core.sequencer.STATE.FETCH_FIRST;
        };

        SELS.prototype.$$updateOutputMemoryRowAddress = function () {
            var regIn0, regIn0Value;

            regIn0 = this.$$cpu.core.instructionDecoder.getRegIn0();
            regIn0Value = this.$$cpu.core.registerSet.read(regIn0);

            this.$$cpu.outputs.memoryRowAddress = BitUtils.shiftRight(regIn0Value, BitUtils.BIT_2) + 1;
        };

        return SELS;
    };

    return _SequencerExecuteLdSecond();        // TODO change it do dependency injection

})();
