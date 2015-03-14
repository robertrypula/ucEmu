var devScrOp = -1;
var devScrContext = 0;
var devScrCanvas = 0;
var devScrSizePix = 1;
var devScrSizeGrid = 1;
var devScrSizeOffsetX = 0;
var devScrSizeOffsetY = 0;
var devScrWidth = 1;
var devScrHeight = 1;
var devScrPixCounter = 0;
var devScrFillStylePrev = -1;
var devScrBrowserWidthPrev = -1;
var devScrBrowserHeightPrev = -1;

function deviceScreenInit()
{
    try {
        devScrCanvas = document.getElementById("c");
        devScrContext = devScrCanvas.getContext("2d");
    } catch (e) {
        devScrCanvas = 0;
        devScrContext = 0;
    }
}

function deviceScreenResize()
{
    var gridSizeH = Math.floor(appBrowserWidth * 0.9 / devScrWidth);
    var gridSizeV = Math.floor(appBrowserHeight * 0.9 / devScrHeight);

    if (gridSizeH > gridSizeV) {
        devScrSizeGrid = gridSizeV;
    } else {
        devScrSizeGrid = gridSizeH;
    }
    devScrSizePix = devScrSizeGrid - (devScrSizeGrid > 2 ? 1 : 0);

    devScrSizeOffsetX = Math.round((appBrowserWidth - (devScrSizeGrid * devScrWidth)) * 0.5);
    devScrSizeOffsetY = Math.round((appBrowserHeight - (devScrSizeGrid * devScrHeight)) * 0.5);
}

function deviceScreenBrowserResizeCheck()
{
    if (devScrBrowserWidthPrev !== appBrowserWidth || devScrBrowserHeightPrev !== appBrowserHeight) {
        devScrCanvas.width = appBrowserWidth;
        devScrCanvas.height = appBrowserHeight;
        devScrContext.fillStyle = '#96a488';
        devScrContext.fillRect(0, 0, appBrowserWidth, appBrowserHeight);
        devScrBrowserWidthPrev = appBrowserWidth;
        devScrBrowserHeightPrev = appBrowserHeight;
        deviceScreenResize();
    }
}

function deviceScreenSetPixelOperation(data)
{
    if (PORT_SCREEN_BYTE_MODE) {
        var x, y;   

        x = devScrPixCounter % devScrWidth;
        y = Math.floor(devScrPixCounter / devScrWidth);
        if (devScrFillStylePrev !== data) {
            devScrContext.fillStyle = data ? '#3b4128' : '#909c7c';
            devScrFillStylePrev = data;
        }
        devScrContext.fillRect(devScrSizeOffsetX + x * devScrSizeGrid, devScrSizeOffsetY + y * devScrSizeGrid, devScrSizePix, devScrSizePix);
        devScrPixCounter = (devScrPixCounter + 1) % (devScrWidth * devScrHeight);
    } else {
        for (var y = 0; y < devScrHeight; y++) {
            for (var x = 0; x < devScrWidth; x++) {
                if (devScrFillStylePrev !== data[y * devScrWidth + x]) {
                    devScrContext.fillStyle = data[y * devScrWidth + x] ? '#3b4128' : '#909c7c';
                    devScrFillStylePrev = data[y * devScrWidth + x];
                }
                devScrContext.fillRect(devScrSizeOffsetX + x * devScrSizeGrid, devScrSizeOffsetY + y * devScrSizeGrid, devScrSizePix, devScrSizePix);
            }
        }
    }
}

function deviceScreenWrite(isOperation, data)
{
    if (!devScrContext) {
        return;
    }

    deviceScreenBrowserResizeCheck();
    
    if (isOperation) {
        devScrOp = data;
        switch (data) {
            case DEV_SCREEN_OPCODE_SET_PIXELS:
                devScrPixCounter = 0;
                break;
        }
    } else {
        switch (devScrOp) {
            case DEV_SCREEN_OPCODE_SET_RES_WIDTH:
                devScrWidth = data;
                deviceScreenResize();
                break;
            case DEV_SCREEN_OPCODE_SET_RES_HEIGHT:
                devScrHeight = data;
                deviceScreenResize();
                break;
            case DEV_SCREEN_OPCODE_SET_PIXELS:
                deviceScreenSetPixelOperation(data);
                break;
        }
    }
}
