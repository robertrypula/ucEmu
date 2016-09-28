var MicrocodeHandlerStFirstC = (function () {
    'use strict';

    _MicrocodeHandlerStFirstC.$inject = [];

    function _MicrocodeHandlerStFirstC() {
        var MESFC;

        MESFC = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESFC.prototype = Object.create(AbstractMicrocode.prototype);
        MESFC.prototype.constructor = MESFC;

        MESFC.prototype.finalizePropagationAndStoreResults = function () {
            var regIn0, regIn0Value;

            regIn0 = InstructionDecoder.getRegIn0(this.$$core.regInstruction);
            regIn0Value = this.$$regFile.read(regIn0);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerStFirstC');
                Logger.log(3, 'regIn0 = ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2));
            }

            this.$$core.regClockTick = ClockTick.getClockTickNext(this.$$core.regClockTick);
            this.$$core.regMemoryRowAddress = MemoryController.getMemoryRowAddressNextRow(regIn0Value);
            this.$$core.regSequencer = this.$$MICROCODE.ST_SECOND_A;
        };

        return MESFC;
    }

    return _MicrocodeHandlerStFirstC();        // TODO change it to dependency injection

})();
