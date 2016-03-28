function rasterizerDrawLineH(x1, x2, y)
{
    if (y < 0 && y >= fbHeight) {
        return;
    }
    
    x1 = x1 < 0 ? 0 : x1;
    x1 = x1 >= fbWidth ? fbWidth - 1 : x1;
    x2 = x2 < 0 ? 0 : x2;
    x2 = x2 >= fbWidth ? fbWidth - 1 : x2;
    
    if (x2 < x1) {
        var tmp = x1;
        
        x1 = x2;
        x2 = tmp;
    }
    
    for (var i = x1; i <= x2; i++) {
        fbSet(i, y);
    }
}

function rasterizerDrawLineV(y1, y2, x)
{
    if (x < 0 && x >= fbWidth) {
        return;
    }
    
    y1 = y1 < 0 ? 0 : y1;
    y1 = y1 >= fbHeight ? fbHeight - 1 : y1;
    y2 = y2 < 0 ? 0 : y2;
    y2 = y2 >= fbHeight ? fbHeight - 1 : y2;
    
    if (y2 < y1) {
        var tmp = y1;
        
        y1 = y2;
        y2 = tmp;
    }
    
    for (var i = y1; i <= y2; i++) {
        fbSet(x, i);
    }
} 

function rasterizerDrawRect(x1, y1, x2, y2)
{
    rasterizerDrawLineH(x1, x2, y1);
    rasterizerDrawLineH(x1, x2, y2);
    rasterizerDrawLineV(y1, y2, x1);
    rasterizerDrawLineV(y1, y2, x2);
}

function rasterizerAsciiToFontIdx(c)
{
    var code;

    if (ASCII_SPACE <= c && c <= ASCII_TILDE) {
        code = c - ASCII_SPACE;
    } else {
        code = 0x5f;
    }

    return code;
}

function rasterizerDrawCharLarge(x, y, c)
{
    var code;

    code = rasterizerAsciiToFontIdx(c);
    for (var _y = 0; _y < 8; _y++) {
        for (var _x = 0; _x < 5; _x++) {
            if (FONT_5x8[code * 5 + _x] & (0x80 >> _y)) {
                fbSet(x + _x, y + _y);
            }
        }
    }
}

function rasterizerDrawCharMedium(x, y, c)
{
    var i, byte, bit;
    var code;

    code = rasterizerAsciiToFontIdx(c);
    i = 14;
    for (var _x = 0; _x < 3; _x++) {
        for (var _y = 0; _y < 5; _y++) {
            byte = i >> 3;
            bit = i & 0x7;
            if (FONT_3x5[code * 2 + 1 - byte] & (0x1 << bit)) {
                fbSet(x + _x, y + _y);
            }
            i--;
        }
    }
}

function rasterizerDrawCharSmall(x, y, c)
{
    var i, byte, bit;
    var code;

    code = rasterizerAsciiToFontIdx(c);
    i = code & 0x1 ? 11 : 23;
    code = code >> 1;

    for (var _x = 0; _x < 3; _x++) {
        for (var _y = 0; _y < 4; _y++) {
            byte = i >> 3;
            bit = i & 0x7;
            if (FONT_3x4_TWOINONE[code * 3 + 2 - byte] & (0x1 << bit)) {
                fbSet(x + _x, y + _y);
            }
            i--;
        }
    }
}

function rasterizerDrawText(x, y, text, size)
{
    if (typeof size === 'undefined') {
        size = 2;
    }

    switch (size) {
        case 0:
            for (var i = 0; i < text.length; i++) {
                rasterizerDrawCharSmall(x, y, text.charCodeAt(i));
                x += 4;
            }
            break;
        case 1:
            for (var i = 0; i < text.length; i++) {
                rasterizerDrawCharMedium(x, y, text.charCodeAt(i));
                x += 4;
            }
            break;
        case 2:
            for (var i = 0; i < text.length; i++) {
                rasterizerDrawCharLarge(x, y, text.charCodeAt(i));
                x += 6;
            }
            break;
    }

}

function rasterizerDrawTriangle(x1, y1, x2, y2, x3, y3)
{
    fbSet(x1, y1);
    fbSet(x2, y2);
    fbSet(x3, y3);

    rasterizerDrawLine(x1, y1, x2, y2);
    rasterizerDrawLine(x2, y2, x3, y3);
    rasterizerDrawLine(x3, y3, x1, y1);
}

function rasterizerDrawLine(x1, y1, x2, y2)
{
    var slowPos, fastPos;
    var fast, slow;
    var xMode, e;

    if (x1 == x2) {
        rasterizerDrawLineV(y1, y2, x1);
        return;
    }

    if (y1 == y2) {
        rasterizerDrawLineH(x1, x2, y1);
        return;
    }

    // TODO: clip line here

    // bresenham line below
    xMode = Math.abs(x2 - x1) >= Math.abs(y2 - y1);
    if ((xMode && x1 > x2) || (!xMode && y1 > y2)) {
        var tmp;

        tmp = x1;
        x1 = x2;
        x2 = tmp;
        tmp = y1;
        y1 = y2;
        y2 = tmp;
    }
    fast = xMode ? x2 - x1 : y2 - y1;
    slow = xMode ? y2 - y1 : x2 - x1;
    slowPos = xMode ? y1 : x1;
    fastPos = xMode ? x1 : y1;
    xMode ? fbSet(fastPos, slowPos) : fbSet(slowPos, fastPos);
    e = fast >> 2;
    for (var i = 0; i < fast; i++) {
        fastPos++;
        e = e - (slow > 0 ? slow : -slow);
        if (e < 0) {
            e = e + fast;
            slowPos = slow > 0 ? slowPos + 1 : slowPos - 1;
        }
        xMode ? fbSet(fastPos, slowPos) : fbSet(slowPos, fastPos);
    }
}

// ----------------- filled triangle attempt -----------

function sign(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

function pointInTriangle(pt, v1, v2, v3) {
    var b1, b2, b3;

    b1 = sign(pt, v1, v2) < 0.0;
    b2 = sign(pt, v2, v3) < 0.0;
    b3 = sign(pt, v3, v1) < 0.0;

    return ((b1 == b2) && (b2 == b3));
}


function rasterizerDrawTriangleFilled(x1, y1, x2, y2, x3, y3) {
    var xMin, xMax, yMin, yMax, y, x, t;

    xMin = x1 < x2 ? x1 : x2;
    xMin = x3 < xMin ? x3 : xMin;
    xMax = x1 > x2 ? x1 : x2;
    xMax = x3 > xMax ? x3 : xMax;

    yMin = y1 < y2 ? y1 : y2;
    yMin = y3 < yMin ? y3 : yMin;
    yMax = y1 > y2 ? y1 : y2;
    yMax = y3 > yMax ? y3 : yMax;

    // rasterizerDrawLine(xMin, yMin, xMin, yMax);
    // rasterizerDrawLine(xMax, yMin, xMax, yMax);

    for (y = 0; y < yMax - yMin; y++) {
        for (x = 0; x < xMax - xMin; x++) {
            t = pointInTriangle(
                { x: xMin + x, y: yMin + y }, 
                { x: x1, y: y1 }, 
                { x: x2, y: y2 }, 
                { x: x3, y: y3 }
            );

            if (t) {
                fbSet(xMin + x, yMin + y);
            }
        }
    }
}