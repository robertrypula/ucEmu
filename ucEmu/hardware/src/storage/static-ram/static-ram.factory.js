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

        SR.ROWS_COUNT = Math.pow(2, CpuBitSize.ADDRESS_ROW);

        SR.prototype.log = function (addressRowStart, addressRowStop, programCounter) {     // TODO remove Logger and change method name
            var i, memoryDump, dataLog;

            memoryDump = [];
            addressRowStart = addressRowStart < 0 ? 0 : addressRowStart;
            for (i = addressRowStart; i < SR.ROWS_COUNT; i++) {
                if (i > addressRowStop) {
                    break;
                }
                memoryDump.push(this.data[i]);

                if (Logger.isEnabled()) {
                    dataLog = BitUtil.hex(this.data[i], CpuBitSize.MEMORY_WIDTH);

                    if (typeof programCounter !== 'undefined') {
                        if (i * 4 <= programCounter && programCounter < (i + 1) * 4) {
                            dataLog += ' <--';
                        }
                    }

                    Logger.log(
                        0,
                        '--- [RAM] --- ' +
                        BitUtil.hex(i, CpuBitSize.ADDRESS_ROW) + ' | ' +
                        BitUtil.hex(i * 4, CpuBitSize.WORD) + ' | ' +      // TODO fix hardcoded '4'
                        dataLog
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
            this.rowAddress = BitUtil.mask(rowAddress, CpuBitSize.ADDRESS_ROW);
            this.$$update();
        };

        SR.prototype.setDataIn = function (dataIn) {
            this.dataIn = BitUtil.mask(dataIn, CpuBitSize.MEMORY_WIDTH);
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
                this.data[i] = BitUtil.random(CpuBitSize.MEMORY_WIDTH);
            }
            this.$$update();
        };

        return SR;
    }

    return _StaticRam();       // TODO change it to dependency injection

})();
