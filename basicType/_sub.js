function sub(a, b)
{
    b = __ASM_nand(b, b);
    b = __ASM_add(b, 1);
    a = __ASM_add(a, b);

    return a;
}
