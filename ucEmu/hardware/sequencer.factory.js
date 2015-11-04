var Sequencer = (function () {
    'use strict';

    _Sequencer.$inject = [];

    function _Sequencer() {
        var S;

        S = function () {
            CpuAware.apply(this, arguments);

            this.$$handlers = [];
            this.STATES = null;

            this.$$initialize();
        };


        S.prototype = Object.create(CpuAware.prototype);
        S.prototype.constructor = S;

        S.prototype.$$initialize = function () {
            this.$$initializeState();
            this.$$initializeHandler();
        };

        S.prototype.$$initializeState = function () {
            this.STATES = {
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
        };

        S.prototype.$$initializeHandler = function () {
            this.$$handlers.push(
                { state: this.STATES.FETCH_FIRST, handler: new SequencerFetchFirst() },
                { state: this.STATES.FETCH_SECOND_AND_DECODE, handler: new SequencerFetchSecondAndDecode() },
                { state: this.STATES.EXECUTE_ADD, handler: new SequencerExecuteAdd() },
                { state: this.STATES.EXECUTE_NAND, handler: new SequencerExecuteNand() },
                { state: this.STATES.EXECUTE_SH, handler: new SequencerExecuteSh() },
                { state: this.STATES.EXECUTE_JNZ, handler: new SequencerExecuteJnz() },
                { state: this.STATES.EXECUTE_COPY, handler: new SequencerExecuteCopy() },
                { state: this.STATES.EXECUTE_IMM, handler: new SequencerExecuteImm() },
                { state: this.STATES.EXECUTE_LD_FIRST, handler: new SequencerExecuteLdFirst() },
                { state: this.STATES.EXECUTE_LD_SECOND, handler: new SequencerExecuteLdSecond() },
                { state: this.STATES.EXECUTE_ST_FIRST, handler: new SequencerExecuteStFirst() },
                { state: this.STATES.EXECUTE_ST_SECOND, handler: new SequencerExecuteStSecond() },
                { state: this.STATES.EXECUTE_ST_THIRD, handler: new SequencerExecuteStThird() },
                { state: this.STATES.EXECUTE_ST_FOURTH, handler: new SequencerExecuteStFourth() }
            );
        };

        S.prototype.$$setCpuAtHandlers = function (cpu) {
            for (var i = 0; i < this.$$handlers.length; i++) {
                if (this.$$handlers[i].handler !== null) {
                    this.$$handlers[i].handler.setCpu(cpu);
                }
            }
        };

        S.prototype.setCpu = function (cpu) {
            CpuAware.prototype.setCpu.apply(this, arguments);
            this.$$setCpuAtHandlers(cpu);
        };

        S.prototype.$$checkState = function (state) {
            if (state < 0 || state >= this.$$handlers.length) {
                throw 'Bad state: ' + state;
            }
        };

        S.prototype.goToNextState = function () {
            var state;

            this.$$checkCpu();
            state = this.$$cpu.registers.regSequencer;
            this.$$checkState(state);
            if (this.$$handlers[state].handler !== null) {
                this.$$handlers[state].handler.run();
            } else {
                throw 'Sequencer handler for state ' + state + ' is not defined';
            }

            this.$$cpu.registers.regTimer = BitUtils.mask(this.$$cpu.registers.regTimer + 1, BitUtils.BYTE_4);
        };

        return S;
    }

    return _Sequencer();       // TODO change it do dependency injection

})();
