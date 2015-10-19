function neq(a, b)
{
    b = __ASM_nand(b, b);
    b = __ASM_add(b, 1);

    if (__ASM_add(a, b)) {
        return 1;
    }

    return 0;
}
