var StaticRam = (function () {
    'use strict';

    _StaticRam.$inject = [];

    function _StaticRam() {
        var SR;

        SR = function (row, writeEnable, dataIn) {
            this.data = new Uint32Array(SR.ROWS_COUNT);
            this.input = {
                row: row,
                writeEnable: writeEnable,
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
            return this.data[this.input.row];
        };

        SR.prototype.setWriteEnable = function (writeEnable) {
            this.input.writeEnable = writeEnable ? 1 : 0;
            this.$$update();
        };

        SR.prototype.setRow = function (row) {
            this.input.row = BitUtil.mask(row, BitSize.ADDRESS_ROW);
            this.$$update();
        };

        SR.prototype.setDataIn = function (dataIn) {
            this.input.dataIn = BitUtil.mask(dataIn, BitSize.MEMORY_WIDTH);
            this.$$update();
        };

        SR.prototype.$$update = function () {
            if (this.input.writeEnable) {
                this.data[this.input.row] = this.input.dataIn;
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
