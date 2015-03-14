
var devKeyboardOp = -1;
var devKeyboardEventQueue = [];
var devKeyboardEvent;

function deviceKeyboardInit()
{
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        deviceKeyboardProcessKeyEvent(evt.keyCode || evt.which || -1, true);
    }
    document.onkeyup = function(evt) {
        evt = evt || window.event;
        deviceKeyboardProcessKeyEvent(evt.keyCode || evt.which || -1, false);
    }
}

function deviceKeyboardProcessKeyEvent(keyCode, pressed)
{
    var devKeyCode = -1;

    switch (keyCode) {
        case 38:
            devKeyCode = DEV_KEYBOARD_SCANCODE_ARROW_UP;
            break;
        case 39:
            devKeyCode = DEV_KEYBOARD_SCANCODE_ARROW_RIGHT;
            break;
        case 40:
            devKeyCode = DEV_KEYBOARD_SCANCODE_ARROW_DOWN;
            break;
        case 37:
            devKeyCode = DEV_KEYBOARD_SCANCODE_ARROW_LEFT;
            break;
        case 87:
            devKeyCode = DEV_KEYBOARD_SCANCODE_GO_UP;
            break;
        case 68:
            devKeyCode = DEV_KEYBOARD_SCANCODE_GO_RIGHT;
            break;
        case 83:
            devKeyCode = DEV_KEYBOARD_SCANCODE_GO_DOWN;
            break;
        case 65:
            devKeyCode = DEV_KEYBOARD_SCANCODE_GO_LEFT;
            break;
        case 27:
            devKeyCode = DEV_KEYBOARD_SCANCODE_ESC;
            break;
        case 13:
            devKeyCode = DEV_KEYBOARD_SCANCODE_ENTER;
            break;
        case 32:
            devKeyCode = DEV_KEYBOARD_SCANCODE_ACTION;
            break;
    }

    if (devKeyCode < 0) {
        return;
    }

    devKeyCode += !pressed ? 128 : 0;
    devKeyboardEventQueue.push(devKeyCode);
}

function deviceKeyboardWrite(isOperation, data)
{
    if (isOperation) {
        devKeyboardOp = data;
        switch (data) {
            case DEV_KEYBOARD_OPCODE_GET_EVENT:
                devKeyboardEvent = devKeyboardEventQueue.length ? devKeyboardEventQueue.shift() : DEV_KEYBOARD_EMPTY_EVENT_QUEUE;
                break;
        }
    }
}

function deviceKeyboardRead()
{
    switch (devKeyboardOp) {
        case DEV_KEYBOARD_OPCODE_GET_EVENT:
            return devKeyboardEvent;
            break;
    }

    return -1;
}
