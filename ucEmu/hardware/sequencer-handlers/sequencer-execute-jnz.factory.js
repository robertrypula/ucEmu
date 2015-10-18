
function sequencerExecuteJnz()
{
    console.log('    :: sequencerExecuteJnz');
    var regIn0 = (self.registers.regInstruction & 0x00F00000) >>> (5 * 4),
        regIn1 = (self.registers.regInstruction & 0x000F0000) >>> (4 * 4),
        regIn0Value = self.core.registerSet.read(regIn0),
        regIn1Value = self.core.registerSet.read(regIn1),
        notZeroFlag = regIn1Value !== 0,
        regPCNext = notZeroFlag ? regIn0Value : self.core.registerSet.getProgramCounter()
        ;

    console.log('    regIn0, regIn1 <-> ' + regIn0 + ', ' + regIn1);
    console.log('    regIn0Value = ' + dumpHex(regIn0Value));
    console.log('    regIn1Value = ' + dumpHex(regIn1Value));
    console.log('    notZeroFlag = ' + (notZeroFlag ? "true (regIn1Value NOT EQUAL zero - jump)" : "false (regIn1Value EQUAL zero - no jump)"));
    console.log('    regPCNext = ' + dumpHex(regPCNext));

    self.registers.regSequencer = self.core.sequencer.STATES.FETCH_FIRST;
    self.core.registerSet.setProgramCounter(regPCNext);
}
