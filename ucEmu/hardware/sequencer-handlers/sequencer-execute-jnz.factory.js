var SequencerExecuteJnz = (function () {
    'use strict';

    var SequencerExecuteJnz = function () {
        var
            self = this,
            cpu = null
        ;

        self.run = function () {
            var regIn0, regIn1, regIn0Value, regIn1Value
                notZeroFlag, regPCNext;

            checkCpu();
            regIn0 = (cpu.registers.regInstruction & 0x00F00000) >>> (5 * 4);
            regIn1 = (cpu.registers.regInstruction & 0x000F0000) >>> (4 * 4);
            regIn0Value = cpu.core.registerSet.read(regIn0);
            regIn1Value = cpu.core.registerSet.read(regIn1);
            notZeroFlag = regIn1Value !== 0;
            regPCNext = notZeroFlag ? regIn0Value : cpu.core.registerSet.getProgramCounter();

            console.log('    :: sequencerExecuteJnz');
            console.log('    regIn0, regIn1 <-> ' + regIn0 + ', ' + regIn1);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    regIn1Value = ' + dumpHex(regIn1Value));
            console.log('    notZeroFlag = ' + (notZeroFlag ? "true (regIn1Value NOT EQUAL zero - jump)" : "false (regIn1Value EQUAL zero - no jump)"));
            console.log('    regPCNext = ' + dumpHex(regPCNext));

            cpu.registers.regSequencer = cpu.core.sequencer.STATES.FETCH_FIRST;
            cpu.core.registerSet.setProgramCounter(regPCNext);
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

    return SequencerExecuteJnz;        // TODO change it do dependency injection

})();
