
function sequencerExecuteLdSecond()
{
    console.log('    :: sequencerExecuteLdSecond');
    var regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4),
        regIn0Value = self.core.registerSet.read(regIn0),
        memoryColumn = regIn0Value & 3,
        shiftAmount = (4 - memoryColumn) * 8,
        memoryReadShifted = shiftAmount < 32 ?
        self.inputs.memoryRead >>> shiftAmount :
            0,
        regMANext = (memoryReadShifted | self.registers.regMemory) >>> (2 * 8)
        ;

    console.log('    regIn0 = ' + regIn0);
    console.log('    regIn0Value = ' + dumpHex(regIn0Value));
    console.log('    memoryColumn = ' + memoryColumn);
    console.log('    inputs.memoryRead = ' + dumpHex(self.inputs.memoryRead));
    console.log('    shiftAmount = ' + shiftAmount);
    console.log('    memoryReadShifted = ' + dumpHex(memoryReadShifted));
    console.log('    regMANext = ' + dumpHex(regMANext));

    self.core.registerSet.setMemoryAccess(regMANext);
    self.registers.regSequencer = self.core.sequencer.STATES.FETCH_FIRST;
}
