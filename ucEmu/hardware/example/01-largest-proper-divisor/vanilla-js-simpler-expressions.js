var number;        // reg00
var divisor;       // reg01
var divisorMinus;  // reg02
var q;             // reg03
var r;             // reg04
var onePlus;       // reg05
var oneMinus;      // reg06
var cond;          // reg07
var rDivisorDiff;  // reg08
var leftmostBit;   // reg09

number = 24323;
onePlus = 1;
oneMinus = -1;
leftmostBit = -15;
divisor = number + oneMinus;
while (true) {
    cond = 1;
    if (divisor) {
        cond = 0;
    }
    if (cond) {
        break;
    }
    r = number;
    q = 0;
    divisorMinus = ~(divisor & divisor);
    divisorMinus = divisorMinus + onePlus;
    while (true) {
        rDivisorDiff = r + divisorMinus;
        cond = rDivisorDiff >>> -leftmostBit;   // get sign
        if (cond) {
            break;
        }
        r = r + divisorMinus;
        q = q + onePlus;
    }
    cond = 1;
    if (r) {
        cond = 0;
    }
    if (cond) {
        break;
    }
    divisor = divisor + oneMinus;
}

console.log(divisor);
