function div(a, b)
{
    var aMinus, bMinus, quotient;

    if (eq(b, 0)) {
        return DEFINE_MAX_POSITIVE_INTEGER;
    }

    aMinus = 0;
    bMinus = 0;
    if (bAnd(a, DEFINE_SIGN_BIT_MASK)) {
        aMinus = 1;
        a = neg(a);
    }
    if (bAnd(b, DEFINE_SIGN_BIT_MASK)) {
        bMinus = 1;
        b = neg(b);
    }

    quotient = _divModCore(a, b, 0);

    if (lXor(aMinus, bMinus)) {
        quotient = neg(quotient);
    }

    return quotient;
}

function mod(a, b)
{
    var aMinus, modulo;

    if (eq(b, 0)) {
        return DEFINE_MAX_POSITIVE_INTEGER;
    }

    aMinus = 0;
    if (bAnd(a, DEFINE_SIGN_BIT_MASK)) {
        aMinus = 1;
        a = neg(a);
    }
    if (bAnd(b, DEFINE_SIGN_BIT_MASK)) {
        b = neg(b);
    }

    modulo = _divModCore(a, b, 1);
    if (aMinus) {
        modulo = neg(modulo);
    }

    return modulo;
}

function _divModCore(a, b, mod)
{
    var mask, quotient, difference;

    mask = 1;
    while (eq(bAnd(b, DEFINE_LAST_U2_NUMBER_BIT_MASK), 0)) {
        b = bSh(b, 1);
        mask = bSh(mask, 1);
    }
    quotient = 0;
    while (mask) {
        difference = sub(a, b);
        if (eq(bAnd(difference, DEFINE_SIGN_BIT_MASK), 0)) {
            a = difference;
            quotient = bOr(quotient, mask);
        }
        b = bSh(b, -1);
        mask = bSh(mask, -1);
    }

    if (mod) {
        return a;
    }

    return quotient;
}
