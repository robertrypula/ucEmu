var StaticRam = (function () {
    'use strict';

    _StaticRam.$inject = [];

    function _StaticRam() {
        var SR;

        SR = function (rowAddress, memoryWE, dataIn) {
            this.data = new Uint32Array(SR.ROWS_COUNT);
            this.input = {
                rowAddress: rowAddress,
                memoryWE: memoryWE,
                dataIn: dataIn
            };

            this.$$initialize();
        };

        SR.ROWS_COUNT = Math.pow(2, BitSize.ADDRESS_ROW);

        SR.prototype.log = function (startRow, stopRow) {
            var i;

            startRow = startRow < 0 ? 0 : startRow;
            for (i = startRow; i < SR.ROWS_COUNT; i++) {
                if (i > stopRow) {
                    break;
                }

                if (Logger.isEnabled()) {
                    Logger.log(
                        0,
                        'StaticRam:  ' +
                        BitUtil.hex(i, BitSize.ADDRESS_ROW) + ' | ' +
                        BitUtil.hex(this.data[i], BitSize.MEMORY_WIDTH)
                    );
                }
            }

            Logger.log(0, '\n');
        };

        SR.prototype.getDataOut = function () {
            return this.data[this.input.rowAddress];
        };

        SR.prototype.setMemoryWE = function (memoryWE) {
            this.input.memoryWE = memoryWE ? 1 : 0;
            this.$$update();
        };

        SR.prototype.setRowAddress = function (rowAddress) {
            this.input.rowAddress = BitUtil.mask(rowAddress, BitSize.ADDRESS_ROW);
            this.$$update();
        };

        SR.prototype.setDataIn = function (dataIn) {
            this.input.dataIn = BitUtil.mask(dataIn, BitSize.MEMORY_WIDTH);
            this.$$update();
        };

        SR.prototype.$$update = function () {
            if (this.input.memoryWE) {
                this.data[this.input.rowAddress] = this.input.dataIn;
            }
        };

        SR.prototype.$$initialize = function () {
            for (var i = 0; i < SR.ROWS_COUNT; i++) {
                this.data[i] = BitUtil.random(BitSize.MEMORY_WIDTH);
            }
            this.$$update();
        };

        return SR;
    }

    return _StaticRam();       // TODO change it to dependency injection

})();
