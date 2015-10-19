var SequencerExecuteImm = (function () {
    'use strict';

    var SequencerExecuteImm = function () {
        var
            self = this,
            cpu = null
        ;

        self.run = function () {
            var regOut, imm;

            checkCpu();
            regOut = (cpu.registers.regInstruction & 0x0F000000) >>> (6 * 4);
            imm = cpu.registers.regInstruction & 0x0000FFFF;

            console.log('    :: sequencerExecuteImm');
            console.log('    regOut = ' + regOut);
            console.log('    imm = ' + dumpHex(imm) + " (store immmediate value at regOut)");

            cpu.registers.regSequencer = cpu.core.sequencer.STATES.FETCH_FIRST;
            cpu.core.registerSet.save(regOut, imm);
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

    return SequencerExecuteImm;        // TODO change it do dependency injection

})();
