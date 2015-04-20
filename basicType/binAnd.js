function bAnd(a, b)
{
    var ab;

    ab = __ASM_nand(a, b);
    a = __ASM_nand(ab, ab);

    return a;
}
