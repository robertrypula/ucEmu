var ControlUnit = (function () {
    'use strict';

    _ControlUnit.$inject = [];

    function _ControlUnit() {
        var CU;

        CU = function (cpu) {
            CpuAware.apply(this, arguments);

            this.$$controlStore = [];

            this.$$initialize();
        };

        CU.MICROCODE = {
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

        CU.prototype = Object.create(CpuAware.prototype);
        CU.prototype.constructor = CU;

        CU.prototype.$$initialize = function () {
            this.$$initializeMicrocode();
        };

        CU.prototype.$$loopState = function (callback) {
            var key;

            for (key in CU.MICROCODE) {
                callback(key, CU.MICROCODE[key]);
            }
        };

        CU.prototype.$$initializeMicrocode = function () {
            var self = this;

            this.$$loopState(function (key, microcode) {
                self.$$controlStore.push(
                    MicrocodeBuilder.build(microcode, self.$$cpu)
                );
            });
        };

        CU.prototype.$$setCpuAtMicrocode = function (cpu) {
            for (var i = 0; i < this.$$controlStore.length; i++) {
                this.$$controlStore[i].setCpu(cpu);
            }
        };

        CU.prototype.$$checkState = function (state) {
            if (state < 0 || state >= this.$$controlStore.length) {
                throw 'Bad state: ' + state;
            }
        };

        CU.prototype.$$getMicrocodeFromControlStore = function () {
            var state;

            state = this.$$cpu.register.regSequencer;
            //this.$$checkState(state);

            return this.$$controlStore[state];

        };

        CU.prototype.setCpu = function (cpu) {
            CpuAware.prototype.setCpu.apply(this, arguments);
            this.$$setCpuAtMicrocode(cpu);
        };

        CU.prototype.goToNextState = function () {
            //this.$$checkCpu();

            this.$$getMicrocodeFromControlStore().goToNextState();

            this.$$cpu.register.regTimer = BitUtils.mask(this.$$cpu.register.regTimer + 1, BitUtils.BYTE_4);
        };

        CU.prototype.updateOutput = function () {
            //this.$$checkCpu();

            this.$$getMicrocodeFromControlStore().updateOutput();
        };

        return CU;
    }

    return _ControlUnit();       // TODO change it do dependency injection

})();
