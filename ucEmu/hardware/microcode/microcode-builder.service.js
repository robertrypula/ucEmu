var MicrocodeBuilder = (function () {
    'use strict';

    _MicrocodeBuilder.$inject = [];

    function _MicrocodeBuilder() {
        function build(microcode, cpu) {
            var uc = null;

            switch (microcode) {
                case ControlUnit.MICROCODE.FETCH_FIRST:
                    uc = new MicrocodeFetchFirst(cpu);
                    break;
                case ControlUnit.MICROCODE.FETCH_SECOND_AND_DECODE:
                    uc = new MicrocodeFetchSecondAndDecode(cpu);
                    break;
                case ControlUnit.MICROCODE.EXECUTE_ADD:
                    uc = new MicrocodeExecuteAdd(cpu);
                    break;
                case ControlUnit.MICROCODE.EXECUTE_NAND:
                    uc = new MicrocodeExecuteNand(cpu);
                    break;
                case ControlUnit.MICROCODE.EXECUTE_SH:
                    uc = new MicrocodeExecuteSh(cpu);
                    break;
                case ControlUnit.MICROCODE.EXECUTE_JNZ:
                    uc = new MicrocodeExecuteJnz(cpu);
                    break;
                case ControlUnit.MICROCODE.EXECUTE_COPY:
                    uc = new MicrocodeExecuteCopy(cpu);
                    break;
                case ControlUnit.MICROCODE.EXECUTE_IMM:
                    uc = new MicrocodeExecuteImm(cpu);
                    break;
                case ControlUnit.MICROCODE.EXECUTE_LD_FIRST:
                    uc = new MicrocodeExecuteLdFirst(cpu);
                    break;
                case ControlUnit.MICROCODE.EXECUTE_LD_SECOND:
                    uc = new MicrocodeExecuteLdSecond(cpu);
                    break;
                case ControlUnit.MICROCODE.EXECUTE_ST_FIRST_A:
                    uc = new MicrocodeExecuteStFirstA(cpu);
                    break;
                case ControlUnit.MICROCODE.EXECUTE_ST_FIRST_B:
                    uc = new MicrocodeExecuteStFirstB(cpu);
                    break;
                case ControlUnit.MICROCODE.EXECUTE_ST_FIRST_C:
                    uc = new MicrocodeExecuteStFirstC(cpu);
                    break;
                case ControlUnit.MICROCODE.EXECUTE_ST_SECOND_A:
                    uc = new MicrocodeExecuteStSecondA(cpu);
                    break;
                case ControlUnit.MICROCODE.EXECUTE_ST_SECOND_B:
                    uc = new MicrocodeExecuteStSecondB(cpu);
                    break;
                case ControlUnit.MICROCODE.EXECUTE_ST_SECOND_C:
                    uc = new MicrocodeExecuteStSecondC(cpu);
                    break;
            }

            if (!uc) {
                throw 'Cannot build microcode: ' + microcode;
            }

            return uc;
        }

        return {
            build: build
        };
    }

    return new _MicrocodeBuilder();        // TODO change it do dependency injection

})();
