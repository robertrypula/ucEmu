var MicrocodeHandlerAdd = (function () {
    'use strict';

     _MicrocodeHandlerAdd.$inject = [];

    function _MicrocodeHandlerAdd() {
        var MEA;

        MEA = function (microcode) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEA.prototype = Object.create(AbstractMicrocode.prototype);
        MEA.prototype.constructor = MEA;

        MEA.prototype.finalizePropagationAndStoreResults = function (registerBag, memoryRead) {
            var regOut, regIn0, regIn1,
                regIn0Value, regIn1Value, regResult;

            regOut = InstructionRegisterSpliter.getRegOut(registerBag.regInstruction);
            regIn0 = InstructionRegisterSpliter.getRegIn0(registerBag.regInstruction);
            regIn1 = InstructionRegisterSpliter.getRegIn1(registerBag.regInstruction);
            regIn0Value = registerBag.registerFile.read(regIn0);
            regIn1Value = registerBag.registerFile.read(regIn1);
            regResult = Alu.add(regIn0Value, regIn1Value);

            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED] sequencerAdd');
                Logger.log(3, 'regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
                Logger.log(3, 'regIn0Value = ' + BitUtil.hex(regIn0Value, BitUtil.BYTE_2));
                Logger.log(3, 'regIn1Value = ' + BitUtil.hex(regIn1Value, BitUtil.BYTE_2));
                Logger.log(3, 'result = ' + BitUtil.hex(regResult, BitUtil.BYTE_2) + ' (sum)');
            }

            registerBag.registerFile.save(regOut, regResult);
            registerBag.regClockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
            registerBag.regMemoryRowAddress = MemoryController.getMemoryRowAddress(registerBag.registerFile.read(RegisterFile.PROGRAM_COUNTER)); // TODO when instruction will save also to PC it will produce troubles in real circuit
            registerBag.regSequencer = Microcode.FETCH_FIRST;
        };

        return MEA;
    }

    return _MicrocodeHandlerAdd();        // TODO change it to dependency injection

})();
