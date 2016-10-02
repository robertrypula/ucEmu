var MicrocodeHandlerImm = (function () {
    'use strict';

    _MicrocodeHandlerImm.$inject = [];

    function _MicrocodeHandlerImm() {
        var MEI;

        MEI = function (microcode) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEI.prototype = Object.create(AbstractMicrocode.prototype);
        MEI.prototype.constructor = MEI;

        MEI.prototype.finalizePropagationAndStoreResults = function (registerBag, instruction, memoryRead) {
            var regOut, imm;

            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            imm = InstructionRegisterSpliter.getImm(registerBag.regInstruction);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerImm');
                Logger.log(3, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
                Logger.log(3, 'regOut = ' + regOut);
                Logger.log(3, 'imm = ' + BitUtil.hex(imm, BitUtil.BYTE_2) + " (store immediate value at regOut)");
            }
            
            registerBag.registerFile.save(regOut, imm);
            registerBag.regClockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            registerBag.regMemoryRowAddress = MemoryController.getMemoryRowAddress(registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER)); // TODO when instruction will save also to PC it will produce troubles in real circuit
            registerBag.regSequencer = Microcode.FETCH_FIRST;
        };

        return MEI;
    }

    return _MicrocodeHandlerImm();        // TODO change it to dependency injection

})();
