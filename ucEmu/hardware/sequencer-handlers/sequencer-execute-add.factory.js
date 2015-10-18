
function sequencerExecuteAdd()
{
    console.log('    :: sequencerExecuteAdd');
    var regOut = (self.registers.regInstruction & 0x0F000000) >>> (6 * 4),
        regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4),
        regIn1 = (self.registers.regInstruction & 0x000F0000) >>> (4 * 4),
        regIn0Value = self.core.registerSet.read(regIn0),
        regIn1Value = self.core.registerSet.read(regIn1),
        regResult = ((regIn1Value & 0xFFFF) + (regIn0Value & 0xFFFF)) & 0xFFFF
        ;

    console.log('    regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
    console.log('    regIn0Value = ' + dumpHex(regIn0Value));
    console.log('    regIn1Value = ' + dumpHex(regIn1Value));
    console.log('    result = ' + dumpHex(regResult) + ' (sum)');

    self.registers.regSequencer = self.core.sequencer.STATES.FETCH_FIRST;
    self.core.registerSet.save(regOut, regResult);
}
