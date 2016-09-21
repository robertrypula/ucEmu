var StaticRam = (function () {
    'use strict';

    _StaticRam.$inject = [];

    function _StaticRam() {
        var SR;

        SR = function (row, writeEnable, dataIn) {
            this.ROWS_COUNT = (64 * 1024) / 4;
            this.data = new Uint32Array(this.ROWS_COUNT);
            this.input = {
                row: row,
                writeEnable: writeEnable,
                dataIn: dataIn
            };

            this.$$initialize();
        };

        SR.prototype.log = function (startRow, stopRow) {
            var i;

            startRow = startRow < 0 ? 0 : startRow;
            for (i = startRow; i < this.ROWS_COUNT; i++) {
                if (i > stopRow) {
                    return;
                }

                if (Logger.isEnabled()) {
                    Logger.log(
                        0,
                        ' StaticRam:  ' +
                        BitUtil.hex(i, BitUtil.BYTE_2) + ' | ' +
                        BitUtil.hex(this.data[i], BitUtil.BYTE_4)
                    );
                }
            }
        };

        SR.prototype.getDataOut = function () {
            return this.data[this.input.row];
        };

        SR.prototype.setWriteEnable = function (writeEnable) {
            this.input.writeEnable = writeEnable ? 1 : 0;
            this.$$update();
        };

        SR.prototype.setRow = function (row) {
            this.input.row = BitUtil.mask(row, BitUtil.BYTE_2 - BitUtil.BIT_2);
            this.$$update();
        };

        SR.prototype.setDataIn = function (dataIn) {
            this.input.dataIn = BitUtil.mask(dataIn, BitUtil.BYTE_4);
            this.$$update();
        };

        SR.prototype.$$update = function () {
            if (this.input.writeEnable) {
                this.data[this.input.row] = this.input.dataIn;
            }
        };

        SR.prototype.$$initialize = function () {
            for (var i = 0; i < this.ROWS_COUNT; i++) {
                this.data[i] = BitUtil.random(BitUtil.BYTE_4);
            }
            this.$$update();
        };

        return SR;
    }

    return _StaticRam();       // TODO change it to dependency injection

})();
