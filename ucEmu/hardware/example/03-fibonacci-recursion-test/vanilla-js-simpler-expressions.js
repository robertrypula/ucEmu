function fibonacci(n) {
    var result;
    var a;
    var b;
    var param;
    var diff;
    var minusFlag;
    var cond;
    var minusOne;

    result = 1;
    minusOne = -1;

    diff = n - 3;
    minusFlag = diff >>> 15;
    cond = 1;
    if (minusFlag) {
        cond = 0;
    }
    if (cond) {
        param = n;
        param = param + minusOne;
        a = fibonacci(param);
        param = param + minusOne;
        b = fibonacci(param);
        result = a + b;
    }
    
    return result;
}

console.log(fibonacci(7));
