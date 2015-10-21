var Sequencer = (function () {
    'use strict';

    var Sequencer = function () {
        var
            self = this,
            handlers = [],
            cpu = null
        ;

        self.STATES = {
            FETCH_FIRST: 0,
            FETCH_SECOND_AND_DECODE: 1,
            EXECUTE_ADD: 2,
            EXECUTE_NAND: 3,
            EXECUTE_SH: 4,
            EXECUTE_JNZ: 5,
            EXECUTE_COPY: 6,
            EXECUTE_IMM: 7,
            EXECUTE_LD_FIRST: 8,
            EXECUTE_LD_SECOND: 9,
            EXECUTE_ST_FIRST: 10,
            EXECUTE_ST_SECOND: 11,
            EXECUTE_ST_THIRD: 12,
            EXECUTE_ST_FOURTH: 13
        };

        function construct()
        {
            handlers.push(
                { state: self.STATES.FETCH_FIRST, handler: new SequencerFetchFirst() },
                { state: self.STATES.FETCH_SECOND_AND_DECODE, handler: new SequencerFetchSecondAndDecode() },
                { state: self.STATES.EXECUTE_ADD, handler: new SequencerExecuteAdd() },
                { state: self.STATES.EXECUTE_NAND, handler: new SequencerExecuteNand() },
                { state: self.STATES.EXECUTE_SH, handler: new SequencerExecuteSh() },
                { state: self.STATES.EXECUTE_JNZ, handler: new SequencerExecuteJnz() },
                { state: self.STATES.EXECUTE_COPY, handler: new SequencerExecuteCopy() },
                { state: self.STATES.EXECUTE_IMM, handler: new SequencerExecuteImm() },
                { state: self.STATES.EXECUTE_LD_FIRST, handler: new SequencerExecuteLdFirst() },
                { state: self.STATES.EXECUTE_LD_SECOND, handler: new SequencerExecuteLdSecond() },
                { state: self.STATES.EXECUTE_ST_FIRST, handler: new SequencerExecuteStFirst() },
                { state: self.STATES.EXECUTE_ST_SECOND, handler: new SequencerExecuteStSecond() },
                { state: self.STATES.EXECUTE_ST_THIRD, handler: new SequencerExecuteStThird() },
                { state: self.STATES.EXECUTE_ST_FOURTH, handler: new SequencerExecuteStFourth() }
            );
        }

        function setCpuAtHandlers(cpuSelf)
        {
            for (var i = 0; i < handlers.length; i++) {
                if (handlers[i].handler !== null) {
                    handlers[i].handler.setCpu(cpuSelf);
                }
            }
        }

        function checkState(state)
        {
            if (state < 0 || state >= handlers.length) {
                throw 'Bad state: ' + state;
            }
        }

        function checkCpu()
        {
            if (cpu === null) {
                throw 'Please attach cpu first';
            }
        }

        self.goToNextState = function () {
            var state;

            checkCpu();
            state = cpu.registers.regSequencer;
            checkState(state);
            if (handlers[state].handler !== null) {
                handlers[state].handler.run();
            } else {
                throw 'Sequencer handler for state ' + state + ' is not defined';
            }

            cpu.registers.regTimer = BitUtils.mask(cpu.registers.regTimer + 1, 32);
        };

        self.setCpu = function (cpuSelf)
        {
            cpu = cpuSelf;
            setCpuAtHandlers(cpuSelf);
        };

        construct();
    };

    return Sequencer;       // TODO change it do dependency injection

})();
