var MicrocodeBuilder = (function () {
    'use strict';

    _MicrocodeBuilder.$inject = [];

    function _MicrocodeBuilder() {
        function build(microcode, cpu) {
            var microcodeObject, M;

            M = Microcode.MICROCODE;
            microcodeObject = null;

            switch (microcode) {
                case M.FETCH_FIRST:
                    microcodeObject = new MicrocodeFetchFirst(cpu);
                    break;
                case M.FETCH_SECOND_AND_DECODE:
                    microcodeObject = new MicrocodeFetchSecondAndDecode(cpu);
                    break;
                case M.EXECUTE_ADD:
                    microcodeObject = new MicrocodeExecuteAdd(cpu);
                    break;
                case M.EXECUTE_NAND:
                    microcodeObject = new MicrocodeExecuteNand(cpu);
                    break;
                case M.EXECUTE_SH:
                    microcodeObject = new MicrocodeExecuteSh(cpu);
                    break;
                case M.EXECUTE_JNZ:
                    microcodeObject = new MicrocodeExecuteJnz(cpu);
                    break;
                case M.EXECUTE_COPY:
                    microcodeObject = new MicrocodeExecuteCopy(cpu);
                    break;
                case M.EXECUTE_IMM:
                    microcodeObject = new MicrocodeExecuteImm(cpu);
                    break;
                case M.EXECUTE_LD_FIRST:
                    microcodeObject = new MicrocodeExecuteLdFirst(cpu);
                    break;
                case M.EXECUTE_LD_SECOND:
                    microcodeObject = new MicrocodeExecuteLdSecond(cpu);
                    break;
                case M.EXECUTE_ST_FIRST_A:
                    microcodeObject = new MicrocodeExecuteStFirstA(cpu);
                    break;
                case M.EXECUTE_ST_FIRST_B:
                    microcodeObject = new MicrocodeExecuteStFirstB(cpu);
                    break;
                case M.EXECUTE_ST_FIRST_C:
                    microcodeObject = new MicrocodeExecuteStFirstC(cpu);
                    break;
                case M.EXECUTE_ST_SECOND_A:
                    microcodeObject = new MicrocodeExecuteStSecondA(cpu);
                    break;
                case M.EXECUTE_ST_SECOND_B:
                    microcodeObject = new MicrocodeExecuteStSecondB(cpu);
                    break;
                case M.EXECUTE_ST_SECOND_C:
                    microcodeObject = new MicrocodeExecuteStSecondC(cpu);
                    break;
            }

            if (!microcodeObject) {
                throw 'Cannot build microcodeObject: ' + microcode;
            }

            return microcodeObject;
        }

        return {
            build: build
        };
    }

    return new _MicrocodeBuilder();        // TODO change it to dependency injection

})();
