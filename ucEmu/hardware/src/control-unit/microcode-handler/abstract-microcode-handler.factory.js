 var AbstractMicrocode = (function () {
    'use strict';

    _AbstractMicrocode.$inject = [];

    function _AbstractMicrocode() {
        var AM;

        AM = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            this.microcode = microcode;
            this.microcodeJump = microcodeJump;
            this.memoryWEPositive = memoryWEPositive;
            this.memoryWENegative = memoryWENegative;
            this.name = name;
        };

        AM.prototype.propagateNewRegisterDataCommon = function (registerBag, memoryRead, instruction, internalResultBag) {
            internalResultBag.sequencer = this.microcodeJump === Microcode.JUMP_IS_AT_INSTRUCTION ? instruction.microcodeJump : this.microcodeJump;
            internalResultBag.clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
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

        AM.prototype.propagateMemoryWE = function (clock, internalResultBag) {
            internalResultBag.memoryWE = MemoryController.getMemoryWE(clock, this.memoryWEPositive, this.memoryWENegative);
        };

        return AM;
    }

    return _AbstractMicrocode();        // TODO change it to dependency injection

})();
