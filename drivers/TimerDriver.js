function driverTimerGetSinceStartMs()
{
    portWrite(PORT_TIMER_OUT, true, DEV_TIMER_OPCODE_UPDATE);
    return portRead(PORT_TIMER_IN);
}
