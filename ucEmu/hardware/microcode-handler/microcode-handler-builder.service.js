var MicrocodeHandlerBuilder = (function () {
    'use strict';

    _MicrocodeHandlerBuilder.$inject = [];

    function _MicrocodeHandlerBuilder() {
        function build(microcode, cpu) {
            var microcodeObject, M;

            M = Microcode.MICROCODE;
            microcodeObject = null;

            switch (microcode) {
                case M.FETCH_FIRST:
                    microcodeObject = new MicrocodeHandlerFetchFirst(cpu);
                    break;
                case M.FETCH_SECOND_AND_DECODE:
                    microcodeObject = new MicrocodeHandlerFetchSecondAndDecode(cpu);
                    break;
                case M.ADD:
                    microcodeObject = new MicrocodeHandlerAdd(cpu);
                    break;
                case M.NAND:
                    microcodeObject = new MicrocodeHandlerNand(cpu);
                    break;
                case M.SH:
                    microcodeObject = new MicrocodeHandlerSh(cpu);
                    break;
                case M.JNZ:
                    microcodeObject = new MicrocodeHandlerJnz(cpu);
                    break;
                case M.COPY:
                    microcodeObject = new MicrocodeHandlerCopy(cpu);
                    break;
                case M.IMM:
                    microcodeObject = new MicrocodeHandlerImm(cpu);
                    break;
                case M.LD_FIRST:
                    microcodeObject = new MicrocodeHandlerLdFirst(cpu);
                    break;
                case M.LD_SECOND:
                    microcodeObject = new MicrocodeHandlerLdSecond(cpu);
                    break;
                case M.ST_FIRST_A:
                    microcodeObject = new MicrocodeHandlerStFirstA(cpu);
                    break;
                case M.ST_FIRST_B:
                    microcodeObject = new MicrocodeHandlerStFirstB(cpu);
                    break;
                case M.ST_FIRST_C:
                    microcodeObject = new MicrocodeHandlerStFirstC(cpu);
                    break;
                case M.ST_SECOND_A:
                    microcodeObject = new MicrocodeHandlerStSecondA(cpu);
                    break;
                case M.ST_SECOND_B:
                    microcodeObject = new MicrocodeHandlerStSecondB(cpu);
                    break;
                case M.ST_SECOND_C:
                    microcodeObject = new MicrocodeHandlerStSecondC(cpu);
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

    return new _MicrocodeHandlerBuilder();        // TODO change it to dependency injection

})();
