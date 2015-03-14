function interpolationBilinear(p4, x, y)
{
    var arr = [];

    arr[0] = interpolationLinear([p4[0], p4[1]], x);
    arr[1] = interpolationLinear([p4[2], p4[3]], x);

    return interpolateLinear(arr, y);
}

function interpolationLinear(p2, x)
{
    return p2[0] * (1.0 - x) + p2[1] * x;
}
