function add(a, b)
{
    a = __ASM_add(a, b);
    
    return a;
}

function sub(a, b)
{
    b = __ASM_nand(b, b);
    b = __ASM_add(b, 1);
    a = __ASM_add(a, b);

    return a;
}

function inc(v)
{
    v = __ASM_add(v, 1);

    return v;
}

function dec(v)
{
    v = __ASM_add(v, BT_MINUS_ONE);

    return v;
}

function neg(v)
{
    v = __ASM_nand(v, v);
    v = __ASM_add(v, 1);

    return v;
}

function mul(a, b)
{
    var aMinus, bMinus, product;

    aMinus = 0;
    bMinus = 0;
    if (bAnd(a, BT_SIGN_MASK)) {
        aMinus = 1;
        a = neg(a);
    }
    if (bAnd(b, BT_SIGN_MASK)) {
        bMinus = 1;
        b = neg(b);
    }

    product = _mulCore(a, b);

    if (lXor(aMinus, bMinus)) {
        product = neg(product);
    }

    return product;
}

function _mulCore(a, b)
{
    var result;

    result = 0;
    while (b) {
        if (bAnd(b, 1)) {
            result = add(result, a);
        }
        b = bSh(b, -1);
        a = bSh(a, 1);
    }

    return result;
}

function div(a, b)
{
    var aMinus, bMinus, q;

    if (eq(b, 0)) {
        return BT_MAX;
    }

    aMinus = 0;
    bMinus = 0;
    if (bAnd(a, BT_SIGN_MASK)) {
        aMinus = 1;
        a = neg(a);
    }
    if (bAnd(b, BT_SIGN_MASK)) {
        bMinus = 1;
        b = neg(b);
    }

    q = _divModCore(a, b, 0);

    if (lXor(aMinus, bMinus)) {
        q = neg(q);
    }

    return q;
}

function mod(a, b)
{
    var aMinus, modulo;

    if (eq(b, 0)) {
        return BT_MAX;
    }

    aMinus = 0;
    if (bAnd(a, BT_SIGN_MASK)) {
        aMinus = 1;
        a = neg(a);
    }
    if (bAnd(b, BT_SIGN_MASK)) {
        b = neg(b);
    }

    modulo = _divModCore(a, b, 1);
    if (aMinus) {
        modulo = neg(modulo);
    }

    return modulo;
}

function _bitIsNotSet(a, b)
{
    a = bAnd(a, b);
    a = eq(a, 0);

    return a;
}

function _divModCore(a, b, mod)
{
    var mask, q, diff;

    mask = 1;
    while (_bitIsNotSet(b, BT_ONE_BEFORE_MSB_MASK)) {
        b = bSh(b, 1);
        mask = bSh(mask, 1);
    }
    q = 0;
    while (mask) {
        diff = sub(a, b);
        if (_bitIsNotSet(diff, BT_SIGN_MASK)) {
            a = diff;
            q = bOr(q, mask);
        }
        b = bSh(b, -1);
        mask = bSh(mask, -1);
    }

    if (mod) {
        return a;
    }

    return q;
}
