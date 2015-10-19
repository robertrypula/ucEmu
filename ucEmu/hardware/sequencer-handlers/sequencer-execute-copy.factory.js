var SequencerExecuteCopy = (function () {
    'use strict';

    var SequencerExecuteCopy = function () {
        var
            self = this,
            cpu = null
        ;

        self.run = function () {
            var regOut, regIn0, regIn0Value;

            checkCpu();
            regOut = (cpu.registers.regInstruction & 0x0F000000) >>> (6 * 4);
            regIn0 = (cpu.registers.regInstruction & 0x00F00000) >>> (5 * 4);
            regIn0Value = cpu.core.registerSet.read(regIn0);

            console.log('    :: sequencerExecuteCopy');
            console.log('    regOut, regIn0 <-> ' + regOut + ', ' + regIn0);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value) + " (COPY, save regIn0Value at regOut)");

            cpu.registers.regSequencer = cpu.core.sequencer.STATES.FETCH_FIRST;
            cpu.core.registerSet.save(regOut, regIn0Value);
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

    return SequencerExecuteCopy;        // TODO change it do dependency injection

})();
