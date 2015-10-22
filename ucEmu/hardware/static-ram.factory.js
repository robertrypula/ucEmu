var StaticRam = (function () {
    'use strict';

    var StaticRam = function (row, writeEnable, dataIn) {
        var self = this,
            data = [],
            inputs = {
                row: row,
                writeEnable: writeEnable,
                dataIn: dataIn
            },
            ROWS_COUNT = (64 * 1024) / 4
        ;

        self.log = function (startRow, stopRow) {
            startRow = startRow < 0 ? 0 : startRow;
            for (var i = startRow; i < ROWS_COUNT; i++) {
                if (i > stopRow) {
                    return;
                }
                console.log(
                    ' StaticRam:  ' +
                    i.toString(16) + ' | ' +
                    dumpHex(data[i])
                );
            }
        };

        self.getDataOut = function () {
            return data[inputs.row];
        };

        self.setWriteEnable = function (writeEnable) {
            inputs.writeEnable = writeEnable ? 1 : 0;
            update();
        };

        self.setRow = function (row) {
            inputs.row = BitUtils.mask(row, BitUtils.BYTE_2 - BitUtils.BIT_2);
            update();
        };

        self.setDataIn = function (dataIn) {
            inputs.dataIn = BitUtils.mask(dataIn, BitUtils.BYTE_4);
            update();
        };

        function update()
        {
            if (inputs.writeEnable) {
                data[inputs.row] = inputs.dataIn;
            }
        }

        function construct()
        {
            for (var i = 0; i < ROWS_COUNT; i++) {
                data.push(
                    BitUtils.random(BitUtils.BYTE_4)
                );
            }
            update();
        }

        construct();
    };

    return StaticRam;       // TODO change it to DI

})();
