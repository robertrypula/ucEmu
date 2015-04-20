var driverScreenWidth = -1;
var driverScreenHeight = -1;

function driverScreenUpdate()
{
    if (driverScreenWidth != fbWidth || driverScreenHeight != fbHeight) {
        portWrite(PORT_SCREEN_OUT, true, DEV_SCREEN_OPCODE_SET_RES_WIDTH);
        portWrite(PORT_SCREEN_OUT, false, fbWidth);
        portWrite(PORT_SCREEN_OUT, true, DEV_SCREEN_OPCODE_SET_RES_HEIGHT);
        portWrite(PORT_SCREEN_OUT, false, fbHeight);
        driverScreenWidth = fbWidth;
        driverScreenHeight = fbHeight;
    }
    portWrite(PORT_SCREEN_OUT, true, DEV_SCREEN_OPCODE_SET_PIXELS);
    for (var i = 0; i < fbBytes; i++) {
        portWrite(PORT_SCREEN_OUT, false, fb[i]);
    }
}
