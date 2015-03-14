var PORT_SCREEN_BYTE_MODE = false;        // keep it false for performance reasons

var PORT_KEYBOARD_IN = 0x00;
var PORT_KEYBOARD_OUT = 0x01;
var PORT_TIMER_IN = 0x02;
var PORT_TIMER_OUT = 0x03;
var PORT_SCREEN_OUT = 0x04;

var DEV_KEYBOARD_SCANCODE_ARROW_UP = 0x00;
var DEV_KEYBOARD_SCANCODE_ARROW_RIGHT = 0x01;
var DEV_KEYBOARD_SCANCODE_ARROW_DOWN = 0x02;
var DEV_KEYBOARD_SCANCODE_ARROW_LEFT = 0x03;
var DEV_KEYBOARD_SCANCODE_GO_UP = 0x04;
var DEV_KEYBOARD_SCANCODE_GO_RIGHT = 0x05;
var DEV_KEYBOARD_SCANCODE_GO_DOWN = 0x06;
var DEV_KEYBOARD_SCANCODE_GO_LEFT = 0x07;
var DEV_KEYBOARD_SCANCODE_ESC = 0x08;
var DEV_KEYBOARD_SCANCODE_ENTER = 0x09;
var DEV_KEYBOARD_SCANCODE_ACTION = 0x0A;
var DEV_KEYBOARD_EMPTY_EVENT_QUEUE = 0xFF;

var DEV_KEYBOARD_OPCODE_GET_EVENT = 0x00;
var DEV_TIMER_OPCODE_UPDATE = 0x00;
var DEV_SCREEN_OPCODE_SET_RES_WIDTH = 0x00;
var DEV_SCREEN_OPCODE_SET_RES_HEIGHT = 0x01;
var DEV_SCREEN_OPCODE_SET_PIXELS = 0x02;

function portWrite(number, opcode, data)
{
    switch (number) {
        case PORT_KEYBOARD_OUT:
            deviceKeyboardWrite(opcode, data);
            break;
        case PORT_SCREEN_OUT:
            deviceScreenWrite(opcode, data);
            break;
        case PORT_TIMER_OUT:
            deviceTimerWrite(opcode, data);
            break;
    }
}

function portRead(number)
{
    switch (number) {
        case PORT_KEYBOARD_IN:
            return deviceKeyboardRead();
            break;
        case PORT_TIMER_IN:
            return deviceTimerRead();
            break;
    }

    return -1;
}

var appBrowserWidth = 0;
var appBrowserHeight = 0;
var appFramePrevMs = 0;
var appFrameMsHistory = [];
var appFrameMsHistoryQueue = 10;

function appReportFps()
{
    var frameNowMs = (new Date()).getTime();
    var frameTimeMs = frameNowMs - appFramePrevMs;
    var fps = -1;

    appFrameMsHistory.push(frameTimeMs);
    if (appFrameMsHistory.length === appFrameMsHistoryQueue) {
        var sum = 0;
        
        for (var i = 0; i < appFrameMsHistoryQueue; i++) {
            sum += appFrameMsHistory[i];
        }
        fps = 1000 / (sum / appFrameMsHistoryQueue);
        appFrameMsHistory.shift();
    }
    
    document.getElementById("fps").innerHTML = Math.round(fps);

    appFramePrevMs = frameNowMs;
}

function appResize()
{
    appBrowserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    appBrowserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

function appAnimationFrame()
{
    appReportFps();
    loop();
    requestAnimationFrame(appAnimationFrame);
}

function appRun()
{
    appResize();

    deviceKeyboardInit();
    deviceScreenInit();
    deviceTimerInit();

    init();
    appAnimationFrame();        
}
