
function sequencerExecuteStFirst()
{
    console.log('    :: sequencerExecuteStFirst');

    /*
     RAM content:
     0x12 0x34 0x56 0x78
     0x9a 0xbc 0xde 0xff

     Data to write 0x61 0x72

     :: 1

     12 34 56 78   ram read  (row + 0)
     11 11 11 00   ram mask           (00 00 11 11 >> col, ones fill)
     12 34 56 00   ram read & ram mask

     00 00 00 61   dataWriteShifted   (dataWrite >> col, zeros fill)

     12 34 56 61   dataWriteShifted | (ram read & ram mask) a

     :: 1a

     data write (WE == true and clock)

     :: 1b

     data hold (WE == false)

     :: 2

     9a bc de ff   ram read  (row + 1)
     00 11 11 11   ram mask           (00 00 11 11 << (4 - col), ones fill)
     00 bc de ff   ram read & ram mask

     72 00 00 00   dataWriteShifted   (dataWrite << (4 - col), zeros fill)

     72 bc de ff   dataWriteShifted | (ram read & ram mask)

     :: 2a

     data write (WE == true and clock)

     :: 2b

     data hold (WE == false)

     */



}
