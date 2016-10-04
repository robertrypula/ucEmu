var MicrocodeHandlerJnz = (function () {
    'use strict';

    _MicrocodeHandlerJnz.$inject = [];

    function _MicrocodeHandlerJnz() {
        var MEJ;

        MEJ = function (microcode, writeEnablePositive, writeEnableNegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEJ.prototype = Object.create(AbstractMicrocode.prototype);
        MEJ.prototype.constructor = MEJ;

        MEJ.prototype.finalizePropagationAndStoreResults = function (registerBag, inputBag, instruction, internalResultBag) {
            var reset, regIn0, regIn1, regIn0Value, regIn1Value,
                notZeroFlag, regPCNext;

            reset = registerBag.regReset;
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn1 = InstructionRegisterSpliter.getRegIn1(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.read(regIn0);
            regIn1Value = registerBag.registerFile.read(regIn1);
            notZeroFlag = regIn1Value !== 0;
            regPCNext = notZeroFlag ? regIn0Value : registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'regIn0, regIn1 <-> ' + regIn0 + ', ' + regIn1);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitSize.REGISTER));
                Logger.log(3, 'regIn1Value = ' + BitUtil.hex(regIn1Value, BitSize.REGISTER));
                Logger.log(3, 'notZeroFlag = ' + (notZeroFlag ? "true (regIn1Value NOT EQUAL zero - jump)" : "false (regIn1Value EQUAL zero - no jump)"));
                Logger.log(3, 'regPCNext = ' + BitUtil.hex(regPCNext, BitSize.REGISTER));
            }

            if (reset) {
                registerBag.resetAll();
            } else {
                registerBag.registerFile.save(RegisterFile.PROGRAM_COUNTER, regPCNext);
                registerBag.regClockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
                registerBag.regMemoryRowAddress = MemoryController.getMemoryRowAddress(registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER)); // TODO when instruction will save also to PC it will produce troubles in real circuit
                registerBag.regSequencer = Microcode.FETCH_FIRST;
            }
            registerBag.regReset = inputBag.reset;
        };

        return MEJ;
    }

    return _MicrocodeHandlerJnz();        // TODO change it to dependency injection

})();
