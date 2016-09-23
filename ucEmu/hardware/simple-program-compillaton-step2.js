reg00 = 24323;
reg05 = 1;
reg06 = -1;
reg09 = 15;
reg01 = reg00 + reg06;
while (true) {  // loopOuter:
    reg07 = 1;
    if (reg01) {
        reg07 = 0;
    }
    if (reg07) {
        break; // imm regPC end
    }
    reg04 = reg00;
    reg03 = 0;
    while (true) { // loopInner:
        reg02 = ~(reg01 & reg01);
        reg02 = reg02 + reg05;
        reg08 = reg04 + reg02;
        reg07 = reg08 >>> reg09;
        if (reg07) {
            break; // imm regPC loopInnerAfter
        }
        reg04 = reg04 + reg02;
        reg03 = reg03 + reg05;
    } // imm regPC loopInner | loopInnerAfter:
    reg07 = 1;
    if (reg04) {
        reg07 = 0;
    }
    if (reg07) {
        break; // imm regPC end
    }
    reg01 = reg01 + reg06;
} // imm regPC loopOuter | end:

console.log(reg01);

// ----------------------------------------
                //
if (reg00) {    // imm reg11 if | jnz reg11 reg00 | imm regPC ifAfter
    /**/        // if:
}               // ifAfter:

// ----------------------------------------

if (reg00) {    // imm reg11 ifAfter | jz  reg11 reg00
}               // ifAfter:
