function lAnd(a, b)
{
    if (a) {
        a = 1;
    }
    
    if (b) {
        b = 1;
    }

    ab = __ASM_nand(a, b);
    a = __ASM_nand(ab, ab);

    return a;
}
