/**
 *  JavaScript implementations of underlying CPU instuctions
 */


function __ASM_nand(a, b)
{
    return ~(a & b);
}

function __ASM_shift(v, amount)
{
    return amount >= 0 
        ? v << amount 
        : v >>> -amount;
}

function __ASM_add(a, b)
{
    return (a + b) >> 0;
}
