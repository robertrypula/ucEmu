function bNot(v)
{
    v = __ASM_nand(v, v);
    
    return v;
}
