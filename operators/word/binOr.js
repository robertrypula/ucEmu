function bOr(a, b)
{
    a = __ASM_nand(a, a);
    b = __ASM_nand(b, b);
    a = __ASM_nand(a, b);

    return a;
}
