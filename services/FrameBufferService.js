var FB_COLORS = 8; // frameBuffer supports only eight 'colors' - 0 is dark, 7 is white

var fb = [];
var fbBytes = 0;
var fbWidth = 0;
var fbHeight = 0;
var fbColor = FB_COLORS - 1;

var fbGrayScale = [
    0xFF, 0xFF, 0xFF, 0xFF, // dark
    0x77, 0xFF, 0xDD, 0xFF, // shade #1
    0x55, 0xFF, 0x55, 0xFF, // shade #2
    0x77, 0xAA, 0xDD, 0xAA  // shade #3
    // next 4 shades are inversions of previous
];

function fbInit(width, height)
{
    var pixels;

    pixels = width * height;
    fbBytes = (pixels >> 3) + (pixels & 0x7 !== 0 ? 1 : 0);
    fb.length = 0;
    for (var i = 0; i < fbBytes; i++) {
        fb.push(0);
    }
    fbWidth = width;
    fbHeight = height;
}

function fbClear()
{
    for (var y = 0; y < fbHeight; y++) {
        for (var x = 0; x < fbWidth; x++) {
            fbSet(x, y);
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

    return fb[y * fbWidth + x] & 0xFF;
}

function fbSet(x, y)
{
    var xShade, yShade;
    var pix;
    var fbGrayIdx;
    var pixIdx;
    var fbByteIdx;
    var fbBytePos;

    if (x < 0 || x >= fbWidth) {
        return;
    }
    if (y < 0 || y >= fbHeight) {
        return;
    }

    xShade = 0x7 & x;
    yShade = 0x3 & y;

    if (fbColor < (FB_COLORS >> 1)) {
        fbGrayIdx = (fbColor << 2) + yShade;
        pix = (fbGrayScale[fbGrayIdx] >> xShade) & 0x1;
    } else {
        fbGrayIdx = ((FB_COLORS - 1 - fbColor) << 2) + yShade;
        pix = (fbGrayScale[fbGrayIdx] >> xShade) & 0x1;
        pix = (~pix) & 0x1;
    }

    pixIdx = y * fbWidth + x;
    fbByteIdx = pixIdx >> 3;
    fbBytePos = pixIdx & 0x7;
    if (pix) {
        fb[fbByteIdx] = fb[fbByteIdx] | (0x80 >> fbBytePos);
    } else {
        fb[fbByteIdx] = fb[fbByteIdx] & (~(0x80 >> fbBytePos) & 0xFF);
    }
}

function fbSetColor(value)
{
    if (value < 0 || value >= FB_COLORS) {
        return;
    }

    fbColor = value;
}