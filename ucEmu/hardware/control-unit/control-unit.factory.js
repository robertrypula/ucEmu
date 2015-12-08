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

        CU.prototype = Object.create(CpuAware.prototype);
        CU.prototype.constructor = CU;

        CU.prototype.$$initialize = function () {
            this.$$initializeMicrocode();
        };

        CU.prototype.$$initializeMicrocode = function () {
            var self = this;

            Microcode.loop(function (key, microcode) {
                self.$$controlStore.push(
                    MicrocodeBuilder.build(microcode, self.$$cpu)
                );
            });
        };

        CU.prototype.$$setCpuAtControlStore = function (cpu) {
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

            state = this.$$cpu.core.regSequencer;
            //this.$$checkState(state);

            return this.$$controlStore[state];

        };

        CU.prototype.setCpu = function (cpu) {
            CpuAware.prototype.setCpu.apply(this, arguments);
            this.$$setCpuAtControlStore(cpu);
        };

        CU.prototype.goToNextState = function () {
            //this.$$checkCpu();

            this.$$getMicrocodeFromControlStore().goToNextState();

            this.$$cpu.core.regTimer = BitUtil.mask(this.$$cpu.core.regTimer + 1, BitUtil.BYTE_4);
        };

        CU.prototype.updateOutput = function () {
            //this.$$checkCpu();

            this.$$getMicrocodeFromControlStore().updateOutput();
        };

        return CU;
    }

    return _ControlUnit();       // TODO change it to dependency injection

})();
