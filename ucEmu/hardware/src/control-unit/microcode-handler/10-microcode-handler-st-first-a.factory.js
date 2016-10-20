var MicrocodeHandlerStFirstA = (function () {
    'use strict';

    /*
    RAM content:
    0x12 0x34 0x56 0x78
    0x9a 0xbc 0xde 0xff

    Data to write 0x61 0x72

    :: 1a

        data prepare

        12 34 56 78   ram read  (row + 0)
        11 11 11 00   ram mask           (00 00 11 11 >> col, ones fill)
        12 34 56 00   ram read & ram mask

        00 00 00 61   dataWriteShifted   (dataWrite >> col, zeros fill)

        12 34 56 61   dataWriteShifted | (ram read & ram mask)

    :: 1b

        data write    WE and clock

    :: 1c

        data hold     WE and !clock

    :: 2a

        data prepare

        9a bc de ff   ram read  (row + 1)
        00 11 11 11   ram mask           (00 00 11 11 << (4 - col), ones fill)
        00 bc de ff   ram read & ram mask

        72 00 00 00   dataWriteShifted   (dataWrite << (4 - col), zeros fill)

        72 bc de ff   dataWriteShifted | (ram read & ram mask)

    :: 2b

        data write    WE and clock

    :: 2c

        data hold     WE and !clock


    |1a |1b |1c |2a |2b |2c |         store sequencer cycles

    __**__**__**__**__**__**__        clock

    ______****________****____        WE

    ____********____********__        valid data for related WE signal



    */
    
    _MicrocodeHandlerStFirstA.$inject = [];

    function _MicrocodeHandlerStFirstA() {
        var MESFA;

        MESFA = function (microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESFA.prototype = Object.create(AbstractMicrocode.prototype);
        MESFA.prototype.constructor = MESFA;

        MESFA.prototype.propagateNewRegisterData = function (registerBag, inputBag, instruction, internalResultBag) {
            var dummyRegisterValue;

            dummyRegisterValue = registerBag.registerFile.out0(RegisterFile.DUMMY_REGISTER);

            internalResultBag.registerSaveIndex = RegisterFile.DUMMY_REGISTER;
            internalResultBag.register = dummyRegisterValue;
            internalResultBag.instruction = registerBag.regInstruction;
            internalResultBag.memoryBuffer = registerBag.regMemoryBuffer;
            internalResultBag.memoryRowAddress = registerBag.regMemoryRowAddress;
            internalResultBag.memoryWrite = registerBag.regMemoryWrite;
        };

        return MESFA;
    }

    return _MicrocodeHandlerStFirstA();        // TODO change it to dependency injection

})();
