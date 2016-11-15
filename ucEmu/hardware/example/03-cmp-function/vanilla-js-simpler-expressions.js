function cpEq(a, b) {
    var diff;       // regFP-2
    var result;
    var bMinus;
    var one;

    one = 1;
    bMinus = ~(b & b);
    bMinus = bMinus + one;

    diff = a + bMinus;

    result = 1;
    if (diff) {
        result = 0;
    }
    
    return result;
}

var a;
var b;
cpEq(1, 2);
