function bXnor(a, b)
{
    var ab, aAb, bAb;

    ab = __ASM_nand(a, b);
    aAb = __ASM_nand(a, ab);
    bAb = __ASM_nand(b, ab);
    a = __ASM_nand(aAb, bAb);
    a = __ASM_nand(a, a);

    return a;
}
