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
