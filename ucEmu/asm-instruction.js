/**
 *  JavaScript implementations of underlying CPU instuctions
 */


function __ASM_nand(a, b)
{
    return ~(a & b);
}

function __ASM_shift(v, amount)
{
    // TODO fix issue with amount >= 32
    return amount >= 0 
        ? v << amount 
        : v >>> -amount;
}

function __ASM_add(a, b)
{
    return (a + b) >> 0;
}
