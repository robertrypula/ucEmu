var fb = [];
var fbWidth = 0;
var fbHeight = 0;

function fbInit(width, height)
{
    fb.length = 0;
    for (var i = 0; i < width * height; i++) {
        fb.push(0);
    }
    fbWidth = width;
    fbHeight = height;
}

function fbClear(value)
{
    for (var y = 0; y < fbHeight; y++) {
        for (var x = 0; x < fbWidth; x++) {
            fb[y * fbWidth + x] = value;
        }
    }
}

function fbGet(x, y)
{
    if (x < 0 || x >= fbWidth) {
        return 0;
    }
    if (y < 0 || y >= fbHeight) {
        return 0;
    }

    return fb[y * fbWidth + x];
}

function fbSet(x, y, value)
{
    if (value < 0 || value >= 16) {
        return;
    }
    if (x < 0 || x >= fbWidth) {
        return;
    }
    if (y < 0 || y >= fbHeight) {
        return;
    }

    fb[y * fbWidth + x] = value;
}
