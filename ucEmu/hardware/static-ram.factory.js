var StaticRam = (function () {
    'use strict';

    _StaticRam.$inject = [];

    function _StaticRam() {
        var SR;

        SR = function (row, writeEnable, dataIn) {
            this.ROWS_COUNT = (64 * 1024) / 4;
            this.data = new Uint32Array(this.ROWS_COUNT);
            this.inputs = {
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
            return this.data[this.inputs.row];
        };

        SR.prototype.setWriteEnable = function (writeEnable) {
            this.inputs.writeEnable = writeEnable ? 1 : 0;
        };

        SR.prototype.setRow = function (row) {
            this.inputs.row = BitUtils.mask(row, BitUtils.BYTE_2 - BitUtils.BIT_2);
        };

        SR.prototype.setDataIn = function (dataIn) {
            this.inputs.dataIn = BitUtils.mask(dataIn, BitUtils.BYTE_4);
        };

        SR.prototype.update = function () {
            if (this.inputs.writeEnable) {
                this.data[this.inputs.row] = this.inputs.dataIn;
            }
        };

        SR.prototype.$$initialize = function () {
            for (var i = 0; i < this.ROWS_COUNT; i++) {
                this.data[i] = BitUtils.random(BitUtils.BYTE_4);
            }
            this.update();
        };

        return SR;
    }

    return _StaticRam();       // TODO change it do dependency injection

})();
