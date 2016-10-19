var MicrocodeHandlerStFirstC = (function () {
    'use strict';

    _MicrocodeHandlerStFirstC.$inject = [];

    function _MicrocodeHandlerStFirstC() {
        var MESFC;

        MESFC = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESFC.prototype = Object.create(AbstractMicrocode.prototype);
        MESFC.prototype.constructor = MESFC;

        MESFC.prototype.propagateNewRegisterData = function (registerBag, inputBag, instruction, internalResultBag) {
            var dummyRegisterValue, regIn0, addressByteFromReg, sequencer, addressRowAsWord, addressRow;

            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            addressByteFromReg = registerBag.registerFile.out0(regIn0);          // TODO use flag: address from reg
            dummyRegisterValue = registerBag.registerFile.out0(RegisterFile.DUMMY_REGISTER);

            sequencer = this.microcodeJump === Microcode.JUMP_IS_AT_INSTRUCTION ? instruction.microcodeJump : this.microcodeJump;

            addressRowAsWord = MemoryController.getAddressRowAsWord(addressByteFromReg);
            addressRowAsWord = Alu.add(addressRowAsWord, 1);     // TODO add '1' as microcode parameter
            addressRow = MemoryController.getAddressRowFromAddressRowAsWord(addressRowAsWord);

            internalResultBag.registerSaveIndex = RegisterFile.DUMMY_REGISTER;
            internalResultBag.register = dummyRegisterValue;
            internalResultBag.sequencer = sequencer;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.clockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = addressRow;
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MESFC;
    }

    return _MicrocodeHandlerStFirstC();        // TODO change it to dependency injection

})();
