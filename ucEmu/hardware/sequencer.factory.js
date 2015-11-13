var Sequencer = (function () {
    'use strict';

    _Sequencer.$inject = [];

    function _Sequencer() {
        var S;

        S = function (cpu) {
            CpuAware.apply(this, arguments);

            this.$$handlers = [];
            this.STATE = {};

            this.$$initialize();
        };


        S.prototype = Object.create(CpuAware.prototype);
        S.prototype.constructor = S;

        S.prototype.$$initialize = function () {
            this.$$initializeState();
            this.$$initializeHandler();
        };

        S.prototype.$$loopState = function (callback) {
            var key;

            for (key in SequencerHandlerBuilder.STATE) {
                callback(key, SequencerHandlerBuilder.STATE[key]);
            }
        };

        S.prototype.$$initializeState = function () {
            var self = this;

            this.$$loopState(function (key, state) {
                self.STATE[key] = state;
            });
        };

        S.prototype.$$initializeHandler = function () {
            var self = this;

            this.$$loopState(function (key, state) {
                self.$$handlers.push({
                    key: key,
                    state: state,
                    handler: SequencerHandlerBuilder.build(state, self.$$cpu)
                });
            });
        };

        S.prototype.$$setCpuAtHandlers = function (cpu) {
            for (var i = 0; i < this.$$handlers.length; i++) {
                if (this.$$handlers[i].handler !== null) {
                    this.$$handlers[i].handler.setCpu(cpu);
                }
            }
        };

        S.prototype.$$checkState = function (state) {
            if (state < 0 || state >= this.$$handlers.length) {
                throw 'Bad state: ' + state;
            }
        };

        S.prototype.$$getHandler = function () {
            var state;

            state = this.$$cpu.registers.regSequencer;
            this.$$checkState(state);

            if (!this.$$handlers[state].handler) {
                throw 'Sequencer handler for state ' + state + ' is not defined';
            }

            return this.$$handlers[state].handler;

        };

        S.prototype.setCpu = function (cpu) {
            CpuAware.prototype.setCpu.apply(this, arguments);
            this.$$setCpuAtHandlers(cpu);
        };

        S.prototype.goToNextState = function () {
            this.$$checkCpu();
            this.$$getHandler().goToNextState();

            this.$$cpu.registers.regTimer = BitUtils.mask(this.$$cpu.registers.regTimer + 1, BitUtils.BYTE_4);
        };

        S.prototype.updateOutput = function () {
            this.$$checkCpu();
            this.$$getHandler().updateOutput();
        };

        return S;
    }

    return _Sequencer();       // TODO change it do dependency injection

})();
