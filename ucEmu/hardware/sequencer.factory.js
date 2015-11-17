var Sequencer = (function () {
    'use strict';

    _Sequencer.$inject = [];

    function _Sequencer() {
        var S;

        S = function (cpu) {
            CpuAware.apply(this, arguments);

            this.$$handler = [];
            this.$$handlerLookup = [];
            this.STATE = {};

            this.$$initialize();
        };


        S.prototype = Object.create(CpuAware.prototype);
        S.prototype.constructor = S;

        S.prototype.$$initialize = function () {
            this.$$initializeState();
            this.$$initializeHandler();
            this.$$buildHandlerLookup();
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
                var entry = {
                    key: key,
                    state: state,
                    handler: SequencerHandlerBuilder.build(state, self.$$cpu)
                };

                self.$$handler.push(entry);
            });
        };

        S.prototype.$$setCpuAtHandlers = function (cpu) {
            for (var i = 0; i < this.$$handler.length; i++) {
                if (this.$$handler[i].handler !== null) {
                    this.$$handler[i].handler.setCpu(cpu);
                }
            }
        };

        S.prototype.$$buildHandlerLookup = function () {
            this.$$handlerLookup.length = 0;
            for (var i = 0; i < this.$$handler.length; i++) {
                if (this.$$handler[i].handler !== null) {
                    this.$$handlerLookup.push(
                        this.$$handler[i].handler
                    );
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

            state = this.$$cpu.registers.regSequencer;
            //this.$$checkState(state);

            if (!this.$$handler[state].handler) {
                throw 'Sequencer handler for state ' + state + ' is not defined';
            }

            return this.$$handler[state].handler;

        };

        S.prototype.setCpu = function (cpu) {
            CpuAware.prototype.setCpu.apply(this, arguments);
            this.$$setCpuAtHandlers(cpu);
        };

        S.prototype.goToNextState = function () {
            //this.$$checkCpu();

            if (0) {
                this.$$handlerLookup[this.$$cpu.registers.regSequencer].$$goToNextState(); 
            } else {
                this.$$getHandler().goToNextState();
            }

            this.$$cpu.registers.regTimer = BitUtils.mask(this.$$cpu.registers.regTimer + 1, BitUtils.BYTE_4);
        };

        S.prototype.updateOutput = function () {
            var h = this.$$handlerLookup[this.$$cpu.registers.regSequencer];

            //this.$$checkCpu();

            if (0) {
                /*
                if (h.$$updateOutputMemoryRowAddress) {
                    h.$$updateOutputMemoryRowAddress();
                } else {
                    this.$$cpu.outputs.memoryRowAddress = 0;                       // floating bus - pulled down by resistors
                }
                if (h.$$updateOutputMemoryWrite) {
                    h.$$updateOutputMemoryWrite();
                } else {
                    this.$$cpu.outputs.memoryWrite = 0;                            // floating bus - pulled down by resistors
                }
                if (h.$$updateOutputMemoryWE) {
                    h.$$updateOutputMemoryWE();
                } else {
                    this.$$cpu.outputs.memoryWE = 0;                               // floating bus - pulled down by resistors                    
                }
                */
            } else {
                this.$$getHandler().updateOutput();
            }
        };

        return S;
    }

    return _Sequencer();       // TODO change it do dependency injection

})();
