var SequencerFetchFirst = (function () {
    'use strict';

    var SequencerFetchFirst = function () {
        var
            self = this,
            cpu = null
        ;

        self.run = function () {
            var memoryColumn, memoryReadShifted;

            checkCpu();
            memoryColumn = cpu.core.registerSet.getProgramCounter() & 3;
            memoryReadShifted = cpu.inputs.memoryRead << (memoryColumn * 8);

            console.log('    :: sequenceFetchFirst');
            console.log('    memoryColumn = ' + dumpHex(memoryColumn));
            console.log('    inputs.memoryRead = ' + dumpHex(cpu.inputs.memoryRead));
            console.log('    memoryReadShifted = ' + dumpHex(memoryReadShifted));

            cpu.registers.regMemory = memoryReadShifted;
            cpu.registers.regSequencer = cpu.core.sequencer.STATES.FETCH_SECOND_AND_DECODE;
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

    return SequencerFetchFirst;        // TODO change it do dependency injection

})();
