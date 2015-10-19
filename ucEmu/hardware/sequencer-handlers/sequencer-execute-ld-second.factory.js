var SequencerExecuteLdSecond = (function () {
    'use strict';

    var SequencerExecuteLdSecond = function () {
        var
            self = this,
            cpu = null
        ;

        self.run = function () {
            var regIn0, regIn0Value, memoryColumn, shiftAmount,
                memoryReadShifted, regMANext;
            
            checkCpu();
            regIn0 = cpu.core.instructionDecoder.getRegIn0();
            regIn0Value = cpu.core.registerSet.read(regIn0);
            memoryColumn = regIn0Value & 3;
            shiftAmount = (4 - memoryColumn) * 8;
            memoryReadShifted = shiftAmount < 32 
                ? self.inputs.memoryRead >>> shiftAmount 
                : 0;
            regMANext = (memoryReadShifted | cpu.registers.regMemory) >>> (2 * 8);

            console.log('    :: sequencerExecuteLdSecond');
            console.log('    regIn0 = ' + regIn0);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    memoryColumn = ' + memoryColumn);
            console.log('    inputs.memoryRead = ' + dumpHex(self.inputs.memoryRead));
            console.log('    shiftAmount = ' + shiftAmount);
            console.log('    memoryReadShifted = ' + dumpHex(memoryReadShifted));
            console.log('    regMANext = ' + dumpHex(regMANext));

            cpu.core.registerSet.setMemoryAccess(regMANext);
            cpu.registers.regSequencer = cpu.core.sequencer.STATES.FETCH_FIRST;
        };

        self.setCpu = function (cpuSelf)
        {
            cpu = cpuSelf;
        };

        function checkCpu()
        {
            if (cpu === null) {
                throw 'Please attach cpu first';
            }
        }
    };

    return SequencerExecuteLdSecond;        // TODO change it do dependency injection

})();
