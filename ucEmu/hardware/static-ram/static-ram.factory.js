var StaticRam = (function () {
    'use strict';

    _StaticRam.$inject = [];

    function _StaticRam() {
        var SR;

        SR = function () {
            this.data = new Uint32Array(SR.ROWS_COUNT);
            this.rowAddress = 0;
            this.memoryWE = 0;
            this.dataIn = 0;

            this.$$initialize();
        };

        SR.ROWS_COUNT = Math.pow(2, BitSize.ADDRESS_ROW);

        SR.prototype.log = function (addressRowStart, addressRowStop) {     // TODO remove Logger and change method name
            var i, memoryDump;

            memoryDump = [];
            addressRowStart = addressRowStart < 0 ? 0 : addressRowStart;
            for (i = addressRowStart; i < SR.ROWS_COUNT; i++) {
                if (i > addressRowStop) {
                    break;
                }
                memoryDump.push(this.data[i]);

                if (Logger.isEnabled()) {
                    Logger.log(
                        0,
                        '--- [RAM] --- ' +
                        BitUtil.hex(i, BitSize.ADDRESS_ROW) + ' | ' +
                        BitUtil.hex(this.data[i], BitSize.MEMORY_WIDTH)
                    );
                }
            }

            return memoryDump;
        };

        SR.prototype.getDataOut = function () {
            return this.data[this.rowAddress];
        };

        SR.prototype.setMemoryWE = function (memoryWE) {
            this.memoryWE = memoryWE ? 1 : 0;
            this.$$update();
        };

        SR.prototype.setRowAddress = function (rowAddress) {
            this.rowAddress = BitUtil.mask(rowAddress, BitSize.ADDRESS_ROW);
            this.$$update();
        };

        SR.prototype.setDataIn = function (dataIn) {
            this.dataIn = BitUtil.mask(dataIn, BitSize.MEMORY_WIDTH);
            this.$$update();
        };

        SR.prototype.$$update = function () {
            if (this.memoryWE) {
                this.data[this.rowAddress] = this.dataIn;
            }
        };

        SR.prototype.$$initialize = function () {
            var i;

            for (i = 0; i < SR.ROWS_COUNT; i++) {
                this.data[i] = BitUtil.random(BitSize.MEMORY_WIDTH);
            }
            this.$$update();
        };

        return SR;
    }

    return _StaticRam();       // TODO change it to dependency injection

})();
