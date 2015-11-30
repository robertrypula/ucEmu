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
            startRow = startRow < 0 ? 0 : startRow;
            for (var i = startRow; i < this.ROWS_COUNT; i++) {
                if (i > stopRow) {
                    return;
                }

                if (Logger.isEnabled()) {
                    Logger.log(
                        0,
                        ' StaticRam:  ' +
                        BitUtils.hex(i, BitUtils.BYTE_2) + ' | ' +
                        BitUtils.hex(this.data[i], BitUtils.BYTE_4)
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
            this.input.row = BitUtils.mask(row, BitUtils.BYTE_2 - BitUtils.BIT_2);
            this.$$update();
        };

        SR.prototype.setDataIn = function (dataIn) {
            this.input.dataIn = BitUtils.mask(dataIn, BitUtils.BYTE_4);
            this.$$update();
        };

        SR.prototype.$$update = function () {
            if (this.input.writeEnable) {
                this.data[this.input.row] = this.input.dataIn;
            }
        };

        SR.prototype.$$initialize = function () {
            for (var i = 0; i < this.ROWS_COUNT; i++) {
                this.data[i] = BitUtils.random(BitUtils.BYTE_4);
            }
            this.$$update();
        };

        return SR;
    }

    return _StaticRam();       // TODO change it to dependency injection

})();
