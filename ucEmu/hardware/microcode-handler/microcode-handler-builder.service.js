var MicrocodeHandlerBuilder = (function () {
    'use strict';

    _MicrocodeHandlerBuilder.$inject = [];

    function _MicrocodeHandlerBuilder() {
        function build(microcode) {
            var microcodeHandler, M;

            M = Microcode;
            microcodeHandler = null;

            switch (microcode) {
                case M.FETCH_FIRST:
                    microcodeHandler = new MicrocodeHandlerFetchFirst(microcode);
                    break;
                case M.FETCH_SECOND_AND_DECODE:
                    microcodeHandler = new MicrocodeHandlerFetchSecondAndDecode(microcode);
                    break;
                case M.ADD:
                    microcodeHandler = new MicrocodeHandlerAdd(microcode);
                    break;
                case M.NAND:
                    microcodeHandler = new MicrocodeHandlerNand(microcode);
                    break;
                case M.SH:
                    microcodeHandler = new MicrocodeHandlerSh(microcode);
                    break;
                case M.JNZ:
                    microcodeHandler = new MicrocodeHandlerJnz(microcode);
                    break;
                case M.COPY:
                    microcodeHandler = new MicrocodeHandlerCopy(microcode);
                    break;
                case M.IMM:
                    microcodeHandler = new MicrocodeHandlerImm(microcode);
                    break;
                case M.LD_FIRST:
                    microcodeHandler = new MicrocodeHandlerLdFirst(microcode);
                    break;
                case M.LD_SECOND:
                    microcodeHandler = new MicrocodeHandlerLdSecond(microcode);
                    break;
                case M.ST_FIRST_A:
                    microcodeHandler = new MicrocodeHandlerStFirstA(microcode);
                    break;
                case M.ST_FIRST_B:
                    microcodeHandler = new MicrocodeHandlerStFirstB(microcode);
                    break;
                case M.ST_FIRST_C:
                    microcodeHandler = new MicrocodeHandlerStFirstC(microcode);
                    break;
                case M.ST_SECOND_A:
                    microcodeHandler = new MicrocodeHandlerStSecondA(microcode);
                    break;
                case M.ST_SECOND_B:
                    microcodeHandler = new MicrocodeHandlerStSecondB(microcode);
                    break;
                case M.ST_SECOND_C:
                    microcodeHandler = new MicrocodeHandlerStSecondC(microcode);
                    break;
            }

            if (!microcodeHandler) {
                throw 'Cannot build microcodeHandler: ' + microcode;
            }

            return microcodeHandler;
        }

        return {
            build: build
        };
    }

    return new _MicrocodeHandlerBuilder();        // TODO change it to dependency injection

})();
