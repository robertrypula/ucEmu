/*
                imm  reg00 0x5F03
                imm  reg05 0x0001
                imm  reg06 0xFFFF
                imm  reg09 0xFFF1
                add  reg01 reg00 reg06
loopOuter:      imm  reg07 0x0001
                imm  reg10 if01After       
                jz   reg10 reg01
                imm  reg07 0x0000
if01After:      imm  reg10 if02After        
                jz   reg10 reg07
                imm  regPC loopOuterAfter
if02After:      copy reg04 reg00
                imm  reg03 0x0000
loopInner:      nand reg02 reg01 reg01
                add  reg02 reg02 reg05
                add  reg08 reg04 reg02
                sh   reg07 reg08 reg09
                imm  reg10 if03After       
                jz   reg10 reg07
                imm  regPC loopInnerAfter
if03After:      add  reg04 reg04 reg02
                add  reg03 reg03 reg05
                imm  regPC loopInner    
loopInnerAfter: imm  reg07 0x0001
                imm  reg10 if04After      
                jz   reg10 reg04
                imm  reg07 0x0000
if04After:      imm  reg10 if05After        
                jz   reg10 reg07
                imm  regPC loopOuterAfter
if05After:      add  reg01 reg01 reg06
                imm  regPC loopOuter
loopOuterAfter: imm  regPC loopOuterAfter    ; reg01 --> 0x074F
*/
