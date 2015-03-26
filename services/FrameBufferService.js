var FB_COLORS = 8; // frameBuffer supports only eight 'colors' - 0 is dark, 7 is white

var fb = [];
var fbWidth = 0;
var fbHeight = 0;
var fbColor = FB_COLORS - 1;

var fbGrayScale = [
    0xFF, 0xFF, 0xFF, 0xFF, // dark
    0xAA, 0xFF, 0x55, 0xFF, // shade #1
    0x55, 0xFF, 0x55, 0xFF, // shade #2
    0x55, 0xAA, 0x55, 0xAA  // shade #3
    // next 4 shades are inversions of previous
];

function fbInit(width, height)
{
    fb.length = 0;
    for (var i = 0; i < width * height; i++) {
        fb.push(FB_COLORS - 1);
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

    return fb[y * fbWidth + x];
}

function fbSet(x, y)
{
    var xShade, yShade;
    var pix;
    var fbGrayIdx;

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

    fb[y * fbWidth + x] = pix;     // TODO change to only pix store
}

function fbSetColor(value)
{
    if (value < 0 || value >= FB_COLORS) {
        return;
    }

    fbColor = value;
}