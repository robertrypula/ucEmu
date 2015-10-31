var StaticRam = (function () {
    'use strict';

    _StaticRam.$inject = [];

    function _StaticRam() {
        var SR;

        SR = function (row, writeEnable, dataIn) {
            this.data = [];
            this.inputs = {
                row: row,
                writeEnable: writeEnable,
                dataIn: dataIn
            };
            this.ROWS_COUNT = (64 * 1024) / 4;

            this.$$initialize();
        };

        SR.prototype.log = function (startRow, stopRow) {
            startRow = startRow < 0 ? 0 : startRow;
            for (var i = startRow; i < this.ROWS_COUNT; i++) {
                if (i > stopRow) {
                    return;
                }
                console.log(
                    ' StaticRam:  ' +
                    i.toString(16) + ' | ' +
                    dumpHex(this.data[i])
                );
            }
        };

        SR.prototype.getDataOut = function () {
            return this.data[this.inputs.row];
        };

        SR.prototype.setWriteEnable = function (writeEnable) {
            this.inputs.writeEnable = writeEnable ? 1 : 0;
            this.$$update();
        };

        SR.prototype.setRow = function (row) {
            this.inputs.row = BitUtils.mask(row, BitUtils.BYTE_2 - BitUtils.BIT_2);
            this.$$update();
        };

        SR.prototype.setDataIn = function (dataIn) {
            this.inputs.dataIn = BitUtils.mask(dataIn, BitUtils.BYTE_4);
            this.$$update();
        };

        SR.prototype.$$update = function () {
            if (this.inputs.writeEnable) {
                this.data[this.inputs.row] = this.inputs.dataIn;
            }
        };

        SR.prototype.$$initialize = function () {
            for (var i = 0; i < this.ROWS_COUNT; i++) {
                this.data.push(
                    BitUtils.random(BitUtils.BYTE_4)
                );
            }
            this.$$update();
        };

        return SR;
    }

    return _StaticRam();       // TODO change it to DI

})();
