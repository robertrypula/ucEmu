function neg(v)
{
    v = __ASM_nand(v, v);
    v = __ASM_add(v, 1);

    return v;
}
