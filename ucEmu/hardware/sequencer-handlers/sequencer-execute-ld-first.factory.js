
function sequencerExecuteLdFirst()
{
    console.log('    :: sequencerExecuteLdFirst');
    var regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4),
        regIn0Value = self.core.registerSet.read(regIn0),
        memoryColumn = regIn0Value & 3,
        memoryReadShifted = self.inputs.memoryRead << (memoryColumn * 8)
        ;

    console.log('    regIn0 = ' + regIn0);
    console.log('    regIn0Value = ' + dumpHex(regIn0Value));
    console.log('    memoryColumn = ' + dumpHex(memoryColumn));
    console.log('    inputs.memoryRead = ' + dumpHex(self.inputs.memoryRead));
    console.log('    memoryReadShifted = ' + dumpHex(memoryReadShifted));

    self.registers.regMemory = memoryReadShifted;
    self.registers.regSequencer = self.core.sequencer.STATES.EXECUTE_LD_SECOND;
}
