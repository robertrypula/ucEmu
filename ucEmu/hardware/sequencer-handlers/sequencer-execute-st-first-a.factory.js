var SequencerExecuteStFirstA = (function () {
    'use strict';

    /*
    RAM content:
    0x12 0x34 0x56 0x78
    0x9a 0xbc 0xde 0xff

    Data to write 0x61 0x72

    :: 1a

        12 34 56 78   ram read  (row + 0)
        11 11 11 00   ram mask           (00 00 11 11 >> col, ones fill)
        12 34 56 00   ram read & ram mask

        00 00 00 61   dataWriteShifted   (dataWrite >> col, zeros fill)

        12 34 56 61   dataWriteShifted | (ram read & ram mask) a

    :: 1b

        data write (WE == true and clock) or (!WE == false and !clock)

    :: 1c

        data hold (WE == false and clock) or (!WE == true and !clock)

    :: 2a

        9a bc de ff   ram read  (row + 1)
        00 11 11 11   ram mask           (00 00 11 11 << (4 - col), ones fill)
        00 bc de ff   ram read & ram mask

        72 00 00 00   dataWriteShifted   (dataWrite << (4 - col), zeros fill)

        72 bc de ff   dataWriteShifted | (ram read & ram mask)

    :: 2b

        data write (WE == true and clock) or (!WE == false and !clock)

    :: 2c

        data hold (WE == false and clock) or (!WE == true and !clock)


    |1a |1b |1c |2a |2b |2c |         store sequencer cycles

    __**__**__**__**__**__**__        clock

    ______**__________**______        WE

    ____********____********__        valid data for related WE signal



    */
    
    _SequencerExecuteStFirstA.$inject = [];

    function _SequencerExecuteStFirstA() {
        var SESFA;

        SESFA = function (cpu) {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SESFA.prototype = Object.create(AbstractSequencerHandler.prototype);
        SESFA.prototype.constructor = SESFA;

        SESFA.prototype.$$goToNextState = function () {

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteStFirstA');
            }

            this.$$cpu.register.regSequencer = this.$$cpu.core.sequencer.STATE.EXECUTE_ST_FIRST_B;
        };

        return SESFA;
    }

    return _SequencerExecuteStFirstA();        // TODO change it do dependency injection

})();
