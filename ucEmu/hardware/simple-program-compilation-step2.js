reg00 = 24323;                    // imm reg00 0x5F03
reg05 = 1;                        // imm reg05 0x0001
reg06 = -1;                       // imm reg06 0xFFFF
reg09 = 15;                       // imm reg09 0xFFF1           ; here we need -15
reg01 = reg00 + reg06;            // add reg01 reg00 reg06
while (true) {                    // loopOuter:
    reg07 = 1;                    // imm reg07 0x0001
    if (reg01) {                  // imm reg10 if01After        | jz reg10 reg01
        reg07 = 0;                // imm reg07 0x0000
    }                             // if01After:
    if (reg07) {                  // imm reg10 if02After        | jz reg10 reg07
        break;                    // imm regPC loopOuterAfter
    }                             // if02After:
    reg04 = reg00;                // copy reg04 reg00
    reg03 = 0;                    // imm reg03 0x0000
    while (true) {                // loopInner:
        reg02 = ~(reg01 & reg01); // nand reg02 reg01 reg01
        reg02 = reg02 + reg05;    // add reg02 reg02 reg05
        reg08 = reg04 + reg02;    // add reg08 reg04 reg02
        reg07 = reg08 >>> reg09;  // sh reg07 reg08 reg09
        if (reg07) {              // imm reg10 if03After        | jz reg10 reg07
            break;                // imm regPC loopInnerAfter
        }                         // if03After:
        reg04 = reg04 + reg02;    // add reg04 reg04 reg02
        reg03 = reg03 + reg05;    // add reg03 reg03 reg05
    }                             // imm regPC loopInner        | loopInnerAfter:
    reg07 = 1;                    // imm reg07 0x0001
    if (reg04) {                  // imm reg10 if04After        | jz reg10 reg04
        reg07 = 0;                // imm reg07 0x0000
    }                             // if04After:
    if (reg07) {                  // imm reg10 if05After        | jz reg10 reg07
        break;                    // imm regPC loopOuterAfter
    }                             // if05After:
    reg01 = reg01 + reg06;        // add reg01 reg01 reg06
}                                 // imm regPC loopOuter        | loopOuterAfter:

console.log(reg01); // --> 0x074F
