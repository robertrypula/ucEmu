 var AbstractMicrocode = (function () {
    'use strict';

    _AbstractMicrocode.$inject = [];

    function _AbstractMicrocode() {
        var AM;

        AM = function (microcode, memoryWEPositive, memoryWENegative, name) {
            this.microcode = microcode;
            this.memoryWEPositive = memoryWEPositive;
            this.memoryWENegative = memoryWENegative;
            this.name = name;
            this.isLogEnabled = false;
        };

        AM.prototype.storeResults = function (internalResultBag, reset, registerBag) {
            if (registerBag.regReset) {
                registerBag.resetAll();
            } else {
                registerBag.registerFile.save(
                    internalResultBag.registerSaveIndex,
                    internalResultBag.register
                );
                registerBag.regSequencer = internalResultBag.sequencer;
                registerBag.regInstruction = internalResultBag.instruction;
                registerBag.regClockTick = internalResultBag.clockTick;
                registerBag.regMemoryBuffer = internalResultBag.memoryBuffer;
                registerBag.regMemoryRowAddress = internalResultBag.memoryRowAddress;
                registerBag.regMemoryWrite = internalResultBag.memoryWrite;
            }
            registerBag.regReset = reset;
        };

        return AM;
    }

    return _AbstractMicrocode();        // TODO change it to dependency injection

})();
