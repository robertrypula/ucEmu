    
var devTimerDateStartMs;
var devTimerSinceStartMs;
var devTimerOp = -1;

function deviceTimerInit()
{
    devTimerDateStartMs = (new Date()).getTime();
}

function deviceTimerWrite(isOperation, data)
{
    if (isOperation) {
        devTimerOp = data;
        switch (data) {
            case DEV_TIMER_OPCODE_UPDATE:
                var dateNow = new Date();
                devTimerSinceStartMs = dateNow.getTime() - devTimerDateStartMs;
                break;
        }
    }
}

function deviceTimerRead()
{
    switch (devTimerOp) {
        case DEV_TIMER_OPCODE_UPDATE:
            return devTimerSinceStartMs;
            break;
    }

    return -1;
}
