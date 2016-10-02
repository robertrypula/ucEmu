var MicrocodeHandlerFetchFirst = (function () {
    'use strict';

    _MicrocodeHandlerFetchFirst.$inject = [];

    function _MicrocodeHandlerFetchFirst() {
        var MFF;

        MFF = function (microcode, writeEnablePositive, writeEnableNegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MFF.prototype = Object.create(AbstractMicrocode.prototype);
        MFF.prototype.constructor = MFF;

        MFF.prototype.finalizePropagationAndStoreResults = function (registerBag, instruction, memoryRead) {
            var column, memoryReadShifted;
            
            column = MemoryController.getColumn(registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER));
            memoryReadShifted = MemoryController.getMemoryReadShiftedLeft(memoryRead, column);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequenceFetchFirst');
                Logger.log(3, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'column = ' + column);
                Logger.log(3, 'input.memoryRead = ' + BitUtil.hex(memoryRead, BitUtil.BYTE_4));
                Logger.log(3, 'memoryReadShifted = ' + BitUtil.hex(memoryReadShifted, BitUtil.BYTE_4));
            }

            registerBag.regClockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            registerBag.regMemoryBuffer = memoryReadShifted;
            registerBag.regMemoryRowAddress = MemoryController.getMemoryRowAddressNextRow(registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER));
            registerBag.regSequencer = Microcode.FETCH_SECOND_AND_DECODE;
            registerBag.regInstruction = memoryReadShifted;
        };

        return MFF;
    }

    return _MicrocodeHandlerFetchFirst();        // TODO change it to dependency injection

})();
