
function sequencerExecuteSh()
{
    console.log('    :: sequencerExecuteSh');
    var regOut = (self.registers.regInstruction & 0x0F000000) >>> (6 * 4),
        regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4),
        regIn1 = (self.registers.regInstruction & 0x000F0000) >>> (4 * 4),
        regIn0Value = self.core.registerSet.read(regIn0),
        regIn1Value = self.core.registerSet.read(regIn1),
        regIn1ValueAbs = regIn1Value & 0x8000 ?
        ((~regIn1Value) + 1) & 0xFFFF :
            regIn1Value,
        regResult = regIn1ValueAbs < 32 ?
        (regIn1Value & 0x8000 ? regIn0Value >>> regIn1ValueAbs : regIn0Value << regIn1Value) & 0xFFFF :
            0
        ;

    console.log('    regOut, regIn0, regIn1 <-> ' + regOut + ', ' + regIn0 + ', ' + regIn1);
    console.log('    regIn0Value = ' + dumpHex(regIn0Value));
    console.log('    regIn1Value = ' + dumpHex(regIn1Value));
    console.log('    regIn1ValueAbs = ' + dumpHex(regIn1ValueAbs));
    console.log('    result = ' + dumpHex(regResult) + ' (BIT SHIFT)');

    self.registers.regSequencer = self.core.sequencer.STATES.FETCH_FIRST;
    self.core.registerSet.save(regOut, regResult);
}
