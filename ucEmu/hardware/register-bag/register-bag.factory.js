var RegisterBag = (function () {
    'use strict';

    _RegisterBag.$inject = [];

    function _RegisterBag() {
        var RB;

        RB = function () {
            // general purpose registers
            this.registerFile = RegisterFileBuilder.build();

            // special purpose registers
            this.regReset = BitUtil.random(BitUtil.BIT_1);
            this.regSequencer = BitUtil.random(BitUtil.BYTE_HALF);
            this.regInstruction = BitUtil.random(BitUtil.BYTE_4);
            this.regClockTick = BitUtil.random(BitUtil.BYTE_4);
            this.regMemoryBuffer = BitUtil.random(BitUtil.BYTE_4);
            this.regMemoryRowAddress = BitUtil.random(BitUtil.BYTE_2 - BitUtil.BIT_2);
            this.regMemoryWrite = BitUtil.random(BitUtil.BYTE_4);
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
