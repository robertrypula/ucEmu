/*
    CPU emulator - 2015.08.15
    ~~~~~~~~~~~~~~~~~~~~~~~~~
 
    Instuction set:

        -----------+----------------------+----+---------------------------------------+-----------------------------------------------
        cycles     | memory               | nr | instuction                            | action
        -----------+----------------------+----+---------------------------------------+-----------------------------------------------
        ? cycles   | 0x0R 0xRR            | 00 | add     regOut, regIn0, regIn1        | regOut = regIn0 + regIn1
        ? cycles   | 0x1R 0xRR            | 01 | nand    regOut, regIn0, regIn1        | regOut = regIn0 nand regIn1
        ? cycles   | 0x2R 0xRR            | 02 | sh      regOut, regIn0, regIn1        | regOut = (regIn1>=0) ? (regIn0 > abs(regIn1))
        ? cycles   | 0x5_ 0xRR            | 03 | jnz     regIn0, regIn1                | if (regIn1!=0) jump to address from regIn0
        ? cycles   | 0x3R 0xR_            | 04 | copy    regOut, regIn0                | regOut = regIn0
        ? cycles   | 0x4R 0x__ 0xCC 0xCC  | 05 | imm     regOut, _constans16bit_       | regOut = _constans16bit_
        ? cycles   | 0x6_ 0xR_            | 06 | ld      regIn0                        | regMem = MemoryAt[regIn0]
        ? cycles   | 0x7_ 0xR_            | 07 | st      regIn0                        | MemoryAt[regIn0] = regMem
        -----------+----------------------+----+---------------------------------------+-----------------------------------------------

        Alternative version of last three instructions. It can save lot of space in memory after program compilation.

        ...        | ...                  | .. | ...                                   | ...
        ? cycles   | 0x4R 0xCC 0xCC       | 05 | imm     regOut, _constant16bit_       | regOut = _constant16bit_
        ? cycles   | 0x6R                 | 06 | ld      regIn0                        | regMem = MemoryAt[regIn0]
        ? cycles   | 0x7R                 | 07 | st      regIn0                        | MemoryAt[regIn0] = regMem
        -----------+----------------------+----+---------------------------------------+-----------------------------------------------

    Registers:        

        We have 16 egisters. Each can hold 16 bits of data.
    
        reg00-11          Normal
        reg12     regFP   FramePointer
        reg13     regSP   StackPointer
        reg14     regMA   MemoryAccess     (hardware)
        reg15     regPC   ProgramCounter   (hardware)

    Memory:

        Adress bus is 16 bits wide so CPU can access up to 65536 bytes (64 KB). Each memory transfer 16 bits wide so if you
        address 0x0010 memory row you will get 0x0010 and 0x0011 byte inside register. Memory connected to CPU is 32 bits
        wide so it contains 16384 rows 4 bytes each.

        0000: 00 00 00 00
        0004: 00 00 00 00
        0008: 00 00 00 00
        000C: 00 00 00 00
             . . .


        FFD0: po po po po   PORT out - row #0   LCD matrix               ; 1111 1111 1101 0000
        FFD4: po po po po   PORT out - row #1   LCD matrix
        FFD8: po po po po   PORT out - row #2   LCD matrix
        FFDC: po po po po   PORT out - row #3   LCD matrix
        FFE0: po po po po   PORT out - row #4   LCD matrix               ; 1111 1111 1110 0000
        FFE4: po po po po   PORT out - row #5   LCD matrix
        FFE8: po po po po   PORT out - row #6   ---
        FFEC: po po po po   PORT out - row #7   ---
        FFF0: pi pi pi pi   PORT in - row #0    Keyboard                 ; 1111 1111 1111 0000
        FFF4: pi pi pi pi   PORT in - row #1    ---
        FFF8: pi pi pi pi   PORT in - row #2    ---
        FFFC: 00 00 00 00   reserved for 32 bit timer inside CPU

    Pins:

        192 bits of out ports (display)  PORT out 24 bytes
        11 bits in ports (keyboard)      PORT in  1.375 bytes
        2 bits power and ground          in - not nesesary in emulator
        1 bit clock                      in
        1 bit reset                      in
        16 bits memory data in           in
        16 bits memory address           out
        16 bits memory data out          out
        1 bit memory WE                  out
        
    
*/

(function() {

    var Cpu = function() {

        this.inputs = {
            clock: false,
            reset: false,
            memoryInput: 0x00000000
        };

        this.outputs = {
            memoryOutput: 0x00000000,
            memoryAddress: 0x0000,
            memoryWE: false
        };

        this.reg00;
        this.reg01;
        this.reg02;
        this.reg03;
        this.reg04;
        this.reg05;
        this.reg06;
        this.reg07;
        this.reg08;
        this.reg09;
        this.reg10;
        this.reg11;
        this.reg12;
        this.reg13;
        this.regMA;
        this.regPC;
        this.regInstr;
        this.regSeq;
        this.regMemRead;
        this.regMemWrite;
    };

    Cpu.prototype.

})();