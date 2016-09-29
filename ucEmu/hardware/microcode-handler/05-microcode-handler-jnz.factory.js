var MicrocodeHandlerJnz = (function () {
    'use strict';

    _MicrocodeHandlerJnz.$inject = [];

    function _MicrocodeHandlerJnz() {
        var MEJ;

        MEJ = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEJ.prototype = Object.create(AbstractMicrocode.prototype);
        MEJ.prototype.constructor = MEJ;

        MEJ.prototype.finalizePropagationAndStoreResults = function () {
            var regIn0, regIn1, regIn0Value, regIn1Value,
                notZeroFlag, regPCNext;

            regIn0 = InstructionDecoder.getRegIn0(this.$$core.regInstruction);
            regIn1 = InstructionDecoder.getRegIn1(this.$$core.regInstruction);
            regIn0Value = this.$$regFile.read(regIn0);
            regIn1Value = this.$$regFile.read(regIn1);
            notZeroFlag = regIn1Value !== 0;
            regPCNext = notZeroFlag ? regIn0Value : this.$$regFile.read(RegisterFile.PROGRAM_COUNTER);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerJnz');
                Logger.log(3, 'regIn0, regIn1 <-> ' + regIn0 + ', ' + regIn1);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2));
                Logger.log(3, 'regIn1Value = ' + BitUtil.hex(regIn1Value, BitUtil.BYTE_2));
                Logger.log(3, 'notZeroFlag = ' + (notZeroFlag ? "true (regIn1Value NOT EQUAL zero - jump)" : "false (regIn1Value EQUAL zero - no jump)"));
                Logger.log(3, 'regPCNext = ' + BitUtil.hex(regPCNext, BitUtil.BYTE_2));
            }

            this.$$regFile.save(RegisterFile.PROGRAM_COUNTER, regPCNext);
            this.$$core.regClockTick = ClockTick.getClockTickNext(this.$$core.regClockTick);
            this.$$core.regMemoryRowAddress = MemoryController.getMemoryRowAddress(this.$$regFile.read(RegisterFile.PROGRAM_COUNTER)); // TODO when instruction will save also to PC it will produce troubles in real circuit 
            this.$$core.regSequencer = this.$$MICROCODE.FETCH_FIRST;
        };

        return MEJ;
    }

    return _MicrocodeHandlerJnz();        // TODO change it to dependency injection

})();
