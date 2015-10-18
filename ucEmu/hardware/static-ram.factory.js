var StaticRam = (function () {
    'use strict';

    var StaticRam = function (row, writeEnable, dataIn) {
        var self = this,
            data = [],
            inputs = {
                row: row,
                writeEnable: writeEnable,
                dataIn: dataIn
            }
        ;

        self.log = function (startRow, stopRow) {
            startRow = startRow < 0 ? 0 : startRow;
            for (var i = startRow; i < (64 * 1024) / 4; i++) {
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
            inputs.writeEnable = writeEnable ? true : false;
            update();
        };

        self.setRow = function (row) {
            inputs.row = row & 0x3FFF;
            update();
        };

        self.setDataIn = function (dataIn) {
            inputs.dataIn = dataIn & 0xFFFFFFFF;
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
            for (var i = 0; i < (64 * 1024) / 4; i++) {
                data.push(0xFFFFFFFF & Math.random() * 0x100000000);
            }
            update();
        }

        construct();
    };

    return StaticRam;       // TODO change it to DI

})();
