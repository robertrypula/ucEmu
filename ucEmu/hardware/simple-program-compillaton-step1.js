var number;        // reg00
var divisor;       // reg01
var divisorMinus;  // reg02
var q;             // reg03
var r;             // reg04
var onePlus;       // reg05
var oneMinus;      // reg06
var cond;          // reg07
var rDivisorDiff;  // reg08

number = 24323;
onePlus = 1;
oneMinus = -1;
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
    while (true) {
        divisorMinus = ~(divisor & divisor);
        divisorMinus = divisorMinus + onePlus;
        rDivisorDiff = r + divisorMinus;
        cond = rDivisorDiff >>> 31; // 15 on SimpleCPU
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
