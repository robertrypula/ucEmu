var MicrocodeHandlerLdFirst = (function () {
    'use strict';

    _MicrocodeHandlerLdFirst.$inject = [];

    function _MicrocodeHandlerLdFirst() {
        var MELF;

        MELF = function (microcode, writeEnablePositive, writeEnableNegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MELF.prototype = Object.create(AbstractMicrocode.prototype);
        MELF.prototype.constructor = MELF;

        MELF.prototype.finalizePropagationAndStoreResults = function (registerBag, inputBag, instruction, internalResultBag) {
            var reset, regIn0, regIn0Value, column, memoryReadShifted;

            reset = registerBag.regReset;
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.read(regIn0);
            column = MemoryController.getColumn(regIn0Value);
            memoryReadShifted = MemoryController.getMemoryReadShiftedLeft(inputBag.memoryRead, column);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'regIn0 = ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitSize.REGISTER));
                Logger.log(3, 'column = ' + column);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(inputBag.memoryRead, BitSize.MEMORY_WIDTH));
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitSize.MEMORY_WIDTH));
            }

            if (reset) {
                registerBag.resetAll();
            } else {
                registerBag.regClockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
                registerBag.regMemoryBuffer = memoryReadShifted;
                registerBag.regMemoryRowAddress = MemoryController.getMemoryRowAddressNextRow(regIn0Value);
                registerBag.regSequencer = Microcode.LD_SECOND;
            }
            registerBag.regReset = inputBag.reset;
        };

        return MELF;
    }

    return _MicrocodeHandlerLdFirst();        // TODO change it to dependency injection

})();
