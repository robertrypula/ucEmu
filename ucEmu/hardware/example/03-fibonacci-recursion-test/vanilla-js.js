function fibonacci(n) {
    var result = 1;

    if (n > 2) {
        result = fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    return result;
}

console.log(fibonacci(7));
