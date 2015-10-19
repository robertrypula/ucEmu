var SequencerExecuteSh = (function () {
    'use strict';

    var SequencerExecuteSh = function () {
        var
            self = this,
            cpu = null
        ;

        self.run = function () {
            var regOut, regIn0, regIn1, 
                regIn0Value, regIn1Value, regIn1ValueAbs, regResult;

            checkCpu();
            regOut = (cpu.registers.regInstruction & 0x0F000000) >>> (6 * 4);
            regIn0 = (cpu.registers.regInstruction & 0x00F00000) >>> (5 * 4);
            regIn1 = (cpu.registers.regInstruction & 0x000F0000) >>> (4 * 4);
            regIn0Value = cpu.core.registerSet.read(regIn0);
            regIn1Value = cpu.core.registerSet.read(regIn1);
            regIn1ValueAbs = regIn1Value & 0x8000 
                ? ((~regIn1Value) + 1) & 0xFFFF 
                : regIn1Value
            ;
            regResult = regIn1ValueAbs < 32 
                ? (regIn1Value & 0x8000 ? regIn0Value >>> regIn1ValueAbs : regIn0Value << regIn1Value) & 0xFFFF 
                : 0
            ;

            console.log('    :: sequencerExecuteSh');
            console.log('    regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    regIn1Value = ' + dumpHex(regIn1Value));
            console.log('    regIn1ValueAbs = ' + dumpHex(regIn1ValueAbs));
            console.log('    result = ' + dumpHex(regResult) + ' (BIT SHIFT)');

            cpu.registers.regSequencer = cpu.registers.sequencer.STATES.FETCH_FIRST;
            cpu.core.registerSet.save(regOut, regResult);
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

    return SequencerExecuteSh;        // TODO change it do dependency injection

})();
