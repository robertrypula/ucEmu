var number, divisor, q, r;

number = 24323;
divisor = number - 1;
while (divisor !== 0) {
    r = number;
    q = 0;
    while (r >= divisor) {
        r -= divisor;
        q++;
    }
    if (r === 0) {
        break;
    }
    divisor--;
}

console.log(divisor);
