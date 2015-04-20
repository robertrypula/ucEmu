function lXor(a, b)
{
    var ab, aAb, bAb;

    if (a) {
        a = 1;
    }
    
    if (b) {
        b = 1;
    }

    ab = __ASM_nand(a, b);
    aAb = __ASM_nand(a, ab);
    bAb = __ASM_nand(b, ab);
    a = __ASM_nand(aAb, bAb);

    return a;
}
