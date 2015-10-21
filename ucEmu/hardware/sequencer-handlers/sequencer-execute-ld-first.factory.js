var SequencerExecuteLdFirst = (function () {
    'use strict';

    var SequencerExecuteLdFirst = function () {
        var
            self = this,
            cpu = null
        ;

        self.run = function () {
            var regIn0, regIn0Value, memoryColumn, memoryReadShifted;

            checkCpu();
            regIn0 = cpu.core.instructionDecoder.getRegIn0();
            regIn0Value = cpu.core.registerSet.read(regIn0);
            memoryColumn = regIn0Value & 3;
            memoryReadShifted = BitUtils.shiftLeft(cpu.inputs.memoryRead, (memoryColumn * 8));

            console.log('    :: sequencerExecuteLdFirst');
            console.log('    regIn0 = ' + regIn0);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    memoryColumn = ' + dumpHex(memoryColumn));
            console.log('    inputs.memoryRead = ' + dumpHex(cpu.inputs.memoryRead));
            console.log('    memoryReadShifted = ' + dumpHex(memoryReadShifted));

            cpu.registers.regMemory = memoryReadShifted;
            cpu.registers.regSequencer = cpu.core.sequencer.STATES.EXECUTE_LD_SECOND;
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

    return SequencerExecuteLdFirst;        // TODO change it do dependency injection

})();
