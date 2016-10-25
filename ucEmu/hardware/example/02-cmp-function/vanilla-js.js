function cpEq(a, b) {
    var diff;
    var result;
    
    result = 1;
    diff = a - b;
    if (diff) {
        result = 0;
    }
    
    return result;
}