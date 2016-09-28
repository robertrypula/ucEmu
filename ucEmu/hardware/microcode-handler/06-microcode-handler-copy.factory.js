var MicrocodeHandlerCopy = (function () {
    'use strict';

    _MicrocodeHandlerCopy.$inject = [];

    function _MicrocodeHandlerCopy() {
        var MEC;

        MEC = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEC.prototype = Object.create(AbstractMicrocode.prototype);
        MEC.prototype.constructor = MEC;

        MEC.prototype.finalizePropagationAndStoreResults = function () {
            var regOut, regIn0, regIn0Value;

            regOut = InstructionDecoder.getRegOut(this.$$core.regInstruction);
            regIn0 = InstructionDecoder.getRegIn0(this.$$core.regInstruction);
            regIn0Value = this.$$regFile.read(regIn0);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerCopy');
                Logger.log(3, 'regOut, regIn0 <-> ' + regOut + ', ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2) + " (COPY, save regIn0Value at regOut)");
            }
            
            this.$$regFile.save(regOut, regIn0Value);
            this.$$core.regClockTick = ClockTick.getClockTickNext(this.$$core.regClockTick);
            this.$$core.regMemoryRowAddress = MemoryController.getMemoryRowAddress(this.$$regFile.getProgramCounter()); // TODO when instruction will save also to PC it will produce troubles in real circuit
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
        };

        return MEC;
    }

    return _MicrocodeHandlerCopy();        // TODO change it to dependency injection

})();
