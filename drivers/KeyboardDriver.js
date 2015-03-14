function driverKeyboardUpdate()
{
    var kbEvent;

    while (true) {
        portWrite(PORT_KEYBOARD_OUT, true, DEV_KEYBOARD_OPCODE_GET_EVENT);
        kbEvent = portRead(PORT_KEYBOARD_IN);
        if (kbEvent !== DEV_KEYBOARD_EMPTY_EVENT_QUEUE) {
            kbNewEvent(kbEvent);
        } else {
            break;
        }
    }
}
