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
            regOut = cpu.core.instructionDecoder.getRegOut();
            imm = cpu.core.instructionDecoder.getImm();

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
