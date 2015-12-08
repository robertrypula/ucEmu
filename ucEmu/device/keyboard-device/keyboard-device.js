var devKeyboardOp = -1;
var devKeyboardEventQueue = [];
var devKeyboardEvent;
var devKeyboardTouchMap = [
    { jsKeyCode: 38, area: [0.000, 0.833, 0.333, 0.667] }, // AU
    { jsKeyCode: 39, area: [0.333, 1.000, 0.666, 0.833] }, // AR
    { jsKeyCode: 40, area: [0.333, 0.833, 0.666, 0.667] }, // AD
    { jsKeyCode: 37, area: [0.333, 0.667, 0.666, 0.500] }, // AL
    { jsKeyCode: 87, area: [0.000, 0.333, 0.333, 0.167] }, // GU
    { jsKeyCode: 68, area: [0.333, 0.500, 0.666, 0.333] }, // GR
    { jsKeyCode: 83, area: [0.333, 0.333, 0.666, 0.167] }, // GD
    { jsKeyCode: 65, area: [0.333, 0.167, 0.666, 0.000] }, // GL
    { jsKeyCode: 27, area: [0.666, 0.167, 1.000, 0.000] }, // ESC
    { jsKeyCode: 13, area: [0.666, 1.000, 1.000, 0.833] }, // ENT
    { jsKeyCode: 32, area: [0.666, 0.667, 1.000, 0.333] }  // ACT
];

/**
 * code with modyfications from: http://www.gianlucaguarini.com/blog/detecting-the-tap-event-on-a-mobile-touch-device-using-javascript/
 */
function devKeyboardTouchSupport(elemId, callback)
{
    // helpers
    var $ = document.querySelector.bind(document),
        getPointerEvent = function(event) {
            return event.targetTouches ? event.targetTouches[0] : event;
        },
        setListener = function(elem, events, callback) {
            var eventsArray = events.split(' '),
                i = eventsArray.length;
            while (i--) {
                elem.addEventListener(eventsArray[i], callback, false);
            }
        },
        getWidthForUnit = function(elem) {
            var w = elem.width;

            return w - 1 > 0 ? w - 1 : 1;
        },
        getHeightForUnit = function(elem) {
            var h = elem.height;
            
            return h - 1 > 0 ? h - 1 : 1;
        },
        reportEvent = function(callback, type, x, y, elem) {
            callback({
                type: type, 
                x: x, 
                y: y, 
                unitX: x / getWidthForUnit(elem), 
                unitY: y / getHeightForUnit(elem)
            });
        };

    var $touchArea = $(elemId),
        touchStarted = false, // detect if a touch event is sarted
        currX = 0,
        currY = 0,
        cachedX = 0,
        cachedY = 0;

    if (typeof callback !== 'function') {
        return;
    }

    setListener($touchArea, 'touchstart mousedown', function(e) {
        var pointer;

        e.preventDefault(); 
        pointer = getPointerEvent(e);
        cachedX = currX = pointer.pageX;  // caching the current x
        cachedY = currY = pointer.pageY;  // caching the current y

        touchStarted = true;

        reportEvent(callback, 'start', currX, currY, $touchArea);
      
        // detecting if after 200ms the finger is still in the same position
        setTimeout(function() {
            if ((cachedX === currX) && !touchStarted && (cachedY === currY)) {
                reportEvent(callback, 'tap', currX, currY, $touchArea);
            }
        }, 200);
    });

    setListener($touchArea, 'touchend mouseup touchcancel', function(e) {
        e.preventDefault();
        touchStarted = false;
        reportEvent(callback, 'end', currX, currY, $touchArea);
    });

    setListener($touchArea, 'touchmove mousemove', function(e) {
        var pointer;

        e.preventDefault();
        pointer = getPointerEvent(e);
        currX = pointer.pageX;
        currY = pointer.pageY;

        if (touchStarted) {
             reportEvent(callback, 'swipe', currX, currY, $touchArea);
        }
    });
}


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

    devKeyboardTouchSupport('canvas', function(d) {
        var jsKeyCode = deviceKeyboardTouchToJsKeyCode(d);

        if (jsKeyCode) {
            deviceKeyboardProcessKeyEvent(jsKeyCode.keyCode, jsKeyCode.pressed);
        }
    });
}

function deviceKeyboardTouchToJsKeyCode(d) 
{
    var keyCode;

    if (d.type === 'start' || d.type === 'end') {
        keyCode = -1;
        for (var i = 0; i < devKeyboardTouchMap.length; i++) {
            var m = devKeyboardTouchMap[i];
            var aT = m.area[0];
            var aR = m.area[1];
            var aB = m.area[2];
            var aL = m.area[3];
            
            if (aL <= d.unitX && d.unitX <= aR && aT <= d.unitY && d.unitY <= aB) {
                keyCode = m.jsKeyCode;
                break;
            }
        }
        if (keyCode >= 0) {
            return {  
                keyCode: keyCode,
                pressed: d.type === 'start' ? true : false
            };
        }
    }

    return null;
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
