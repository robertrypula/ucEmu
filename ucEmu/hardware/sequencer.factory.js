var Sequencer = (function () {
    'use strict';

    _Sequencer.$inject = [];

    function _Sequencer() {
        var S;

        S = function (cpu) {
            CpuAware.apply(this, arguments);

            this.$$handler = [];

            this.$$initialize();
        };

        S.MICROCODE = {
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
            EXECUTE_ST_FIRST_A: 10,
            EXECUTE_ST_FIRST_B: 11,
            EXECUTE_ST_FIRST_C: 12,
            EXECUTE_ST_SECOND_A: 13,
            EXECUTE_ST_SECOND_B: 14,
            EXECUTE_ST_SECOND_C: 15
        };

        S.prototype = Object.create(CpuAware.prototype);
        S.prototype.constructor = S;

        S.prototype.$$initialize = function () {
            this.$$initializeHandler();
        };

        S.prototype.$$loopState = function (callback) {
            var key;

            for (key in S.MICROCODE) {
                callback(key, S.MICROCODE[key]);
            }
        };

        S.prototype.$$initializeHandler = function () {
            var self = this;

            this.$$loopState(function (key, state) {
                self.$$handler.push(
                    SequencerHandlerBuilder.build(state, self.$$cpu)
                );
            });
        };

        S.prototype.$$setCpuAtHandlers = function (cpu) {
            for (var i = 0; i < this.$$handler.length; i++) {
                if (this.$$handler[i].handler !== null) {
                    this.$$handler[i].handler.setCpu(cpu);
                }
            }
        };

        S.prototype.$$checkState = function (state) {
            if (state < 0 || state >= this.$$handler.length) {
                throw 'Bad state: ' + state;
            }
        };

        S.prototype.$$getHandler = function () {
            var state;

            state = this.$$cpu.register.regSequencer;
            //this.$$checkState(state);

            return this.$$handler[state];

        };

        S.prototype.setCpu = function (cpu) {
            CpuAware.prototype.setCpu.apply(this, arguments);
            this.$$setCpuAtHandlers(cpu);
        };

        S.prototype.goToNextState = function () {
            //this.$$checkCpu();

            this.$$getHandler().goToNextState();

            this.$$cpu.register.regTimer = BitUtils.mask(this.$$cpu.register.regTimer + 1, BitUtils.BYTE_4);
        };

        S.prototype.updateOutput = function () {
            //this.$$checkCpu();

            this.$$getHandler().updateOutput();
        };

        return S;
    }

    return _Sequencer();       // TODO change it do dependency injection

})();
