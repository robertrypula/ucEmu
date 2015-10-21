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
            regOut = cpu.core.instructionDecoder.getRegOut();
            regIn0 = cpu.core.instructionDecoder.getRegIn0();
            regIn1 = cpu.core.instructionDecoder.getRegIn1();
            regIn0Value = cpu.core.registerSet.read(regIn0);
            regIn1Value = cpu.core.registerSet.read(regIn1);
            regIn1ValueAbs = regIn1Value & 0x8000 
                ? ((~regIn1Value) + 1) & 0xFFFF 
                : regIn1Value
            ;
            regResult = cpu.core.alu.sh(regIn0Value, regIn1ValueAbs, regIn1Value & 0x8000);

            console.log('    :: sequencerExecuteSh');
            console.log('    regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    regIn1Value = ' + dumpHex(regIn1Value));
            console.log('    regIn1ValueAbs = ' + dumpHex(regIn1ValueAbs));
            console.log('    result = ' + dumpHex(regResult) + ' (BIT SHIFT)');

            cpu.registers.regSequencer = cpu.core.sequencer.STATES.FETCH_FIRST;
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
