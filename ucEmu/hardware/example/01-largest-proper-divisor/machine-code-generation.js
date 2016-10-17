reg00 = 24323;                    // imm reg00 0x5F03                           |    50 5F03
reg05 = 1;                        // imm reg05 0x0001                           |    55 0001
reg06 = -1;                       // imm reg06 0xFFFF                           |    56 FFFF
reg09 = -15;                      // imm reg09 0xFFF1                           |    59 FFF1
reg01 = reg00 + reg06;            // add reg01 reg00 reg06                      |    01 06
while (true) {                    // _a:                                        |_a:
    reg07 = 1;                    // imm reg07 0x0001                           |    57 0001
    if (reg01) {                  // imm reg10 _b           jz reg10 reg01      |    5A **_b        30 A1
        reg07 = 0;                // imm reg07 0x0000                           |    57 0000
    }                             // _b:                                        |_b:
    if (reg07) {                  // imm reg10 _c           jz reg10 reg07      |    5A **_c        30 A7
        break;                    // imm regPC _i                               |    5F **_i
    }                             // _c:                                        |_c:
    reg04 = reg00;                // copy reg04 reg00                           |    44 00
    reg03 = 0;                    // imm reg03 0x0000                           |    53 0000
    reg02 = ~(reg01 & reg01);     // nand reg02 reg01 reg01                     |    12 11
    reg02 = reg02 + reg05;        // add reg02 reg02 reg05                      |    02 25
    while (true) {                // _d:                                        |_d:
        reg08 = reg04 + reg02;    // add reg08 reg04 reg02                      |    08 42
        reg07 = reg08 >>> -reg09; // sh reg07 reg08 reg09                       |    27 89
        if (reg07) {              // imm reg10 _e           jz reg10 reg07      |    5A **_e        30 A7
            break;                // imm regPC _f                               |    5F **_f
        }                         // _e:                                        |_e:
        reg04 = reg04 + reg02;    // add reg04 reg04 reg02                      |    04 42
        reg03 = reg03 + reg05;    // add reg03 reg03 reg05                      |    03 35
    }                             // imm regPC _d          _f:                  |    5F **_d        _f:
    reg07 = 1;                    // imm reg07 0x0001                           |    57 0001
    if (reg04) {                  // imm reg10 _g           jz reg10 reg04      |    5A **_g        30 A4
        reg07 = 0;                // imm reg07 0x0000                           |    57 0000
    }                             // _g:                                        |_g:
    if (reg07) {                  // imm reg10 _h           jz reg10 reg07      |    5A **_h        30 A7
        break;                    // imm regPC _i                               |    5F **_i
    }                             // _h:                                        |_h:
    reg01 = reg01 + reg06;        // add reg01 reg01 reg06                      |    01 16
}                                 // imm regPC _a          _i:                  |    5F _a          _i:
                                  // imm regPC _i                               |    5F _i
console.log(reg01); // --> 0x074F
