var RegisterBag = (function () {
    'use strict';

    _RegisterBag.$inject = [];

    function _RegisterBag() {
        var RB;

        RB = function () {
            // general purpose registers
            this.registerFile = RegisterFileBuilder.build();

            // special purpose registers
            this.regReset = BitUtil.random(BitSize.SINGLE_BIT);
            this.regSequencer = BitUtil.random(BitSize.SEQUENCER);
            this.regInstruction = BitUtil.random(BitSize.MEMORY_WIDTH);
            this.regClockTick = BitUtil.random(BitSize.MEMORY_WIDTH);
            this.regMemoryBuffer = BitUtil.random(BitSize.MEMORY_WIDTH);
            this.regMemoryRowAddress = BitUtil.random(BitSize.ADDRESS_ROW);
            this.regMemoryWrite = BitUtil.random(BitSize.MEMORY_WIDTH);
        };

        RB.prototype.resetAll = function () {
            this.regSequencer = 0;
            this.regInstruction = 0;
            this.regClockTick = 0;

            this.regMemoryBuffer = 0;
            this.regMemoryRowAddress = 0;
            this.regMemoryWrite = 0;

            this.registerFile.reset();

            // !!! regReset register is excluded from reset !!!
        };

        return RB;
    }

    return _RegisterBag();       // TODO change it to dependency injection

})();
