var SequencerExecuteAdd = (function () {
    'use strict';

    var SequencerExecuteAdd = function () {
        var
            self = this,
            cpu = null
        ;

        self.run = function () {
            var regOut, regIn0, regIn1,
                regIn0Value, regIn1Value, regResult;

            checkCpu();
            regOut = cpu.core.instructionDecoder.getRegOut();
            regIn0 = cpu.core.instructionDecoder.getRegIn0();
            regIn1 = cpu.core.instructionDecoder.getRegIn1();
            regIn0Value = cpu.core.registerSet.read(regIn0);
            regIn1Value = cpu.core.registerSet.read(regIn1);
            regResult = cpu.core.alu.add(regIn0Value, regIn1Value);

            console.log('    :: sequencerExecuteAdd');
            console.log('    regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
            console.log('    regIn0Value = ' + dumpHex(regIn0Value));
            console.log('    regIn1Value = ' + dumpHex(regIn1Value));
            console.log('    result = ' + dumpHex(regResult) + ' (sum)');

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

    return SequencerExecuteAdd;        // TODO change it do dependency injection

})();