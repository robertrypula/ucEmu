function bXor(a, b)
{
    var ab, aAb, bAb;

    ab = __ASM_nand(a, b);
    aAb = __ASM_nand(a, ab);
    bAb = __ASM_nand(b, ab);
    a = __ASM_nand(aAb, bAb);

    return a;
}
