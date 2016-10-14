var RegisterBag = (function () {
    'use strict';

    _RegisterBag.$inject = [];

    function _RegisterBag() {
        var RB;

        RB = function () {
            // general purpose registers
            this.registerFile = RegisterFileBuilder.build();

            // special purpose registers
            this.regReset = BitUtil.random(CpuBitSize.SINGLE_BIT);
            this.regSequencer = BitUtil.random(CpuBitSize.SEQUENCER);
            this.regInstruction = BitUtil.random(CpuBitSize.MEMORY_WIDTH);
            this.regClockTick = BitUtil.random(CpuBitSize.MEMORY_WIDTH);
            this.regMemoryBuffer = BitUtil.random(CpuBitSize.MEMORY_WIDTH);
            this.regMemoryRowAddress = BitUtil.random(CpuBitSize.ADDRESS_ROW);
            this.regMemoryWrite = BitUtil.random(CpuBitSize.MEMORY_WIDTH);
        };

        RB.prototype.resetAll = function () {
            this.registerFile.reset();

            // !!! regReset register is excluded from reset !!!
            this.regSequencer = 0;
            this.regInstruction = 0;
            this.regClockTick = 0;
            this.regMemoryBuffer = 0;
            this.regMemoryRowAddress = 0;
            this.regMemoryWrite = 0;
        };

        RB.prototype.serialize = function () {
            var out;

            out = this.registerFile.serialize();
            out += this.regReset;
            out += this.regSequencer;
            out += this.regInstruction;
            out += this.regClockTick;
            out += this.regMemoryBuffer;
            out += this.regMemoryRowAddress;
            out += this.regMemoryWrite;

            return out;
        };

        return RB;
    }

    return _RegisterBag();       // TODO change it to dependency injection

})();
