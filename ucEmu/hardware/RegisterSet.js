var RegisterSet = function () {
  var
    self = this,
    registers = {
      // data registers
      reg00: 0xFFFF & Math.random() * 0x10000,
      reg01: 0xFFFF & Math.random() * 0x10000,
      reg02: 0xFFFF & Math.random() * 0x10000,
      reg03: 0xFFFF & Math.random() * 0x10000,
      reg04: 0xFFFF & Math.random() * 0x10000,
      reg05: 0xFFFF & Math.random() * 0x10000,
      reg06: 0xFFFF & Math.random() * 0x10000,
      reg07: 0xFFFF & Math.random() * 0x10000,
      reg08: 0xFFFF & Math.random() * 0x10000,
      reg09: 0xFFFF & Math.random() * 0x10000,
      reg10: 0xFFFF & Math.random() * 0x10000,
      reg11: 0xFFFF & Math.random() * 0x10000,
      reg12: 0xFFFF & Math.random() * 0x10000,
      reg13: 0xFFFF & Math.random() * 0x10000,
      regMA: 0xFFFF & Math.random() * 0x10000,
      regPC: 0xFFFF & Math.random() * 0x10000
    }
  ;

  function construct()
  {

  }

  self.reset = function () {
    registers.reg00 = 0x0000;
    registers.reg01 = 0x0000;
    registers.reg02 = 0x0000;
    registers.reg03 = 0x0000;
    registers.reg04 = 0x0000;
    registers.reg05 = 0x0000;
    registers.reg06 = 0x0000;
    registers.reg07 = 0x0000;
    registers.reg08 = 0x0000;
    registers.reg09 = 0x0000;
    registers.reg10 = 0x0000;
    registers.reg11 = 0x0000;
    registers.reg12 = 0x0000;
    registers.reg13 = 0x0000;
    registers.regMA = 0x0000;
    registers.regPC = 0x0000;
  };

  construct();
};