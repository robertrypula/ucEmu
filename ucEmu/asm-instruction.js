/**
 *  JavaScript implementations of underlying CPU instuctions
 */


function __ASM_nand(a, b)
{
    return ~(a & b);
}

function __ASM_shift(v, amount)
{
    var result = 0;

    if (amount > -32 && amount < 32) {
        result = amount >= 0 
            ? v << amount 
            : v >>> -amount;
    }
    
    return result;
}

function __ASM_add(a, b)
{
    return (a + b) >> 0;
}
