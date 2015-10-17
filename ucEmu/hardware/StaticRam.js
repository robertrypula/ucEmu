var StaticRam = function (row, writeEnable, dataIn) {
  var self = this,
    data = [],
    inputs = {
      row: row,
      writeEnable: writeEnable,
      dataIn: dataIn
    };

  this.log = function (startRow, stopRow) {
    startRow = startRow < 0 ? 0 : startRow;
    for (var i = startRow; i < (64*1024) / 4; i++) {
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

  this.getDataOut = function () {
    return data[inputs.row];
  };

  this.setWriteEnable = function (writeEnable) {
    inputs.writeEnable = writeEnable ? true : false;
    update();
  };

  this.setRow = function (row) {
    inputs.row = row & 0x3FFF;
    update();
  };

  this.setDataIn = function (dataIn) {
    inputs.dataIn = dataIn & 0xFFFFFFFF;
    update();
  };

  function update() {
    if (inputs.writeEnable) {
      data[inputs.row] = inputs.dataIn;
    }
  }

  function init() {
    for (var i = 0; i < (64*1024) / 4; i++) {
      data.push(0xFFFFFFFF & Math.random() * 0x100000000);
    }
    update();
  }

  init();
};
