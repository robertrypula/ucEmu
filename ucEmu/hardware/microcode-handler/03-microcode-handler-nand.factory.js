var MicrocodeHandlerNand = (function () {
    'use strict';

    _MicrocodeHandlerNand.$inject = [];

    function _MicrocodeHandlerNand() {
        var MEN;

        MEN = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEN.prototype = Object.create(AbstractMicrocode.prototype);
        MEN.prototype.constructor = MEN;

        MEN.prototype.finalizePropagationAndStoreResults = function () {
            var regOut, regIn0, regIn1,
                regIn0Value, regIn1Value, regResult;

            regOut = InstructionDecoder.getRegOut(this.$$core.regInstruction);
            regIn0 = InstructionDecoder.getRegIn0(this.$$core.regInstruction);
            regIn1 = InstructionDecoder.getRegIn1(this.$$core.regInstruction);
            regIn0Value = this.$$regFile.read(regIn0);
            regIn1Value = this.$$regFile.read(regIn1);
            regResult = this.$$alu.nand(regIn0Value, regIn1Value);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerNand');
                Logger.log(3, 'regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2));
                Logger.log(3, 'regIn1Value = ' + BitUtil.hex(regIn1Value, BitUtil.BYTE_2));
                Logger.log(3, 'result = ' + BitUtil.hex(regResult, BitUtil.BYTE_2) + ' (NAND)');
            }
            
            this.$$regFile.save(regOut, regResult);
            this.$$core.regClockTick = ClockTick.getClockTickNext(this.$$core.regClockTick);
            this.$$core.regMemoryRowAddress = MemoryController.getMemoryRowAddress(this.$$regFile.getProgramCounter()); // TODO when instruction will save also to PC it will produce troubles in real circuit
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
        };

        return MEN;
    }

    return _MicrocodeHandlerNand();        // TODO change it to dependency injection

})();
