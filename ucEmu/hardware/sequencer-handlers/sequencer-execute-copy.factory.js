
function sequencerExecuteCopy()
{
    console.log('    :: sequencerExecuteCopy');
    var regOut = (self.registers.regInstruction & 0x0F000000) >>> (6 * 4),
        regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4),
        regIn0Value = self.core.registerSet.read(regIn0)
        ;

    console.log('    regOut, regIn0 <-> ' + regOut + ', ' + regIn0);
    console.log('    regIn0Value = ' + dumpHex(regIn0Value) + " (COPY, save regIn0Value at regOut)");

    self.registers.regSequencer = self.core.sequencer.STATES.FETCH_FIRST;
    self.core.registerSet.save(regOut, regIn0Value);
}
