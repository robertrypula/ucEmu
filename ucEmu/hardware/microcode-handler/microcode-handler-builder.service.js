var MicrocodeHandlerBuilder = (function () {
    'use strict';

    _MicrocodeHandlerBuilder.$inject = [];

    function _MicrocodeHandlerBuilder() {
        function build(microcode) {
            var microcodeHandler, M;

            M = Microcode.MICROCODE;
            microcodeHandler = null;

            switch (microcode) {
                case M.FETCH_FIRST:
                    microcodeHandler = new MicrocodeHandlerFetchFirst();
                    break;
                case M.FETCH_SECOND_AND_DECODE:
                    microcodeHandler = new MicrocodeHandlerFetchSecondAndDecode();
                    break;
                case M.ADD:
                    microcodeHandler = new MicrocodeHandlerAdd();
                    break;
                case M.NAND:
                    microcodeHandler = new MicrocodeHandlerNand();
                    break;
                case M.SH:
                    microcodeHandler = new MicrocodeHandlerSh();
                    break;
                case M.JNZ:
                    microcodeHandler = new MicrocodeHandlerJnz();
                    break;
                case M.COPY:
                    microcodeHandler = new MicrocodeHandlerCopy();
                    break;
                case M.IMM:
                    microcodeHandler = new MicrocodeHandlerImm();
                    break;
                case M.LD_FIRST:
                    microcodeHandler = new MicrocodeHandlerLdFirst();
                    break;
                case M.LD_SECOND:
                    microcodeHandler = new MicrocodeHandlerLdSecond();
                    break;
                case M.ST_FIRST_A:
                    microcodeHandler = new MicrocodeHandlerStFirstA();
                    break;
                case M.ST_FIRST_B:
                    microcodeHandler = new MicrocodeHandlerStFirstB();
                    break;
                case M.ST_FIRST_C:
                    microcodeHandler = new MicrocodeHandlerStFirstC();
                    break;
                case M.ST_SECOND_A:
                    microcodeHandler = new MicrocodeHandlerStSecondA();
                    break;
                case M.ST_SECOND_B:
                    microcodeHandler = new MicrocodeHandlerStSecondB();
                    break;
                case M.ST_SECOND_C:
                    microcodeHandler = new MicrocodeHandlerStSecondC();
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
