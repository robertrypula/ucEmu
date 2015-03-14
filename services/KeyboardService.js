var kbKeyAU;
var kbKeyAR;
var kbKeyAD;
var kbKeyAL;
var kbKeyGU;
var kbKeyGR;
var kbKeyGD;
var kbKeyGL;
var kbKeyESC;
var kbKeyENT;
var kbKeyACT;
var kbStates = [];
var kbEvents = [];

function kbInit()
{
    kbKeyAU = DEV_KEYBOARD_SCANCODE_ARROW_UP;
    kbKeyAR = DEV_KEYBOARD_SCANCODE_ARROW_RIGHT;
    kbKeyAD = DEV_KEYBOARD_SCANCODE_ARROW_DOWN;
    kbKeyAL = DEV_KEYBOARD_SCANCODE_ARROW_LEFT;
    kbKeyGU = DEV_KEYBOARD_SCANCODE_GO_UP;
    kbKeyGR = DEV_KEYBOARD_SCANCODE_GO_RIGHT;
    kbKeyGD = DEV_KEYBOARD_SCANCODE_GO_DOWN;
    kbKeyGL = DEV_KEYBOARD_SCANCODE_GO_LEFT;
    kbKeyESC = DEV_KEYBOARD_SCANCODE_ESC;
    kbKeyENT = DEV_KEYBOARD_SCANCODE_ENTER;
    kbKeyACT = DEV_KEYBOARD_SCANCODE_ACTION;

    kbStates[kbKeyAU] = false;
    kbStates[kbKeyAR] = false;
    kbStates[kbKeyAD] = false;
    kbStates[kbKeyAL] = false;
    kbStates[kbKeyGU] = false;
    kbStates[kbKeyGR] = false;
    kbStates[kbKeyGD] = false;
    kbStates[kbKeyGL] = false;
    kbStates[kbKeyESC] = false;
    kbStates[kbKeyENT] = false;
    kbStates[kbKeyACT] = false;
}

function kbPressed(c)
{
    return kbStates[c];
}

function kbNewEvent(kbEvent)
{
    kbEvents.push(kbEvent);
    kbStates[kbEvent < 128 ? kbEvent : kbEvent - 128] = kbEvent < 128 ? true : false;
}
