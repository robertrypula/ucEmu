
function sequencerExecuteImm()
{
    console.log('    :: sequencerExecuteImm');
    var regOut = (self.registers.regInstruction & 0x0F000000) >>> (6 * 4),
        imm = self.registers.regInstruction & 0x0000FFFF
        ;

    console.log('    regOut = ' + regOut);
    console.log('    imm = ' + dumpHex(imm) + " (store immmediate value at regOut)");

    self.registers.regSequencer = self.core.sequencer.STATES.FETCH_FIRST;
    self.core.registerSet.save(regOut, imm);
}
