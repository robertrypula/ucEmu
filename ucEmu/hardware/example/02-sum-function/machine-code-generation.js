var sumResult;

function sum(a, b) {
    var result;

    result = a + b;

    return result;
}

sumResult = sum(12, 8);

console.log(sumResult);

/*
 push {A}
     st regSP {A}
     imm tmp 2
     add regSP regSP tmp

---

 push arg03
 push arg02
 push arg01
 call {A}
     copy tmp regPC
     imm  tmp_2  {number}
     add  tmp tmp tmp_2
     st   regSP tmp
     imm  tmp 2
     add  regSP regSP tmp
     imm  regPC {A}
 {some-next}
 */