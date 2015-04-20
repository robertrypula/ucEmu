function gte(a, b)
{
    var diff, negDiffFlag, tmp;

    b = __ASM_nand(b, b);
    b = __ASM_add(b, 1);
    diff = __ASM_add(a, b);

    if (diff) {
        tmp = __ASM_nand(diff, DEFINE_SIGN_BIT_MASK);
        negDiffFlag = __ASM_nand(tmp, tmp);
        if (negDiffFlag) {
            return 0;
        } else {
            return 1;
        }
    }

    return 1;
}
