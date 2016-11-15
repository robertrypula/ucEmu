/*
push implementation:

    im24        reg4, -3
    add         regSP, regSP, reg4
    st24        regSP, regIn0

pop implementation:

    ld24        regIn0, regSP
    im08        reg4, 3
    add         regSP, regSP, reg4

Intel x86 example:

    Inside function
    foo:                        ; foo(arg0, arg1, arg2);
        push ebp                ; save previous function frame pointer
        mov ebp, esp            ; create current function frame pointer
        sub esp, N              ; N = number of bytes for local variables

        ...                     ; function body (you can also push registers on stack and pop them at the end)

        mov esp, ebp            ; restore stack (destroys all local vars)
        pop ebp                 ; restore previous function frame pointer
        ret                     ; return from function (pops return address from stack)

    Inside previous function

        push  arg2              ; push arguments on stack in reverse order
        push  arg1
        push  arg0
        call  foo               ; call function (pushes return address to stack)
        add   esp, 3*4          ; instruction adds 3*4 bytes to stack pointer to destroy 3 arguments used in foo function



 */