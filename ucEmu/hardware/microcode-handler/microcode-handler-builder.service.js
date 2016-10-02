var MicrocodeHandlerBuilder = (function () {
    'use strict';

    _MicrocodeHandlerBuilder.$inject = [];

    function _MicrocodeHandlerBuilder() {
        function build(microcode, writeEnablePositive, writeEnableNegative, name) {
            var
                microcodeHandler = null,
                M = Microcode;

            switch (microcode) {
                case M.FETCH_FIRST:
                    microcodeHandler = new MicrocodeHandlerFetchFirst(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
                    break;
                case M.FETCH_SECOND_AND_DECODE:
                    microcodeHandler = new MicrocodeHandlerFetchSecondAndDecode(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
                    break;
                case M.ADD:
                    microcodeHandler = new MicrocodeHandlerAdd(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
                    break;
                case M.NAND:
                    microcodeHandler = new MicrocodeHandlerNand(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
                    break;
                case M.SH:
                    microcodeHandler = new MicrocodeHandlerSh(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
                    break;
                case M.JNZ:
                    microcodeHandler = new MicrocodeHandlerJnz(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
                    break;
                case M.COPY:
                    microcodeHandler = new MicrocodeHandlerCopy(
                        microcode, writeEnablePositive, writeEnableNegative, name);
                    break;
                case M.IMM:
                    microcodeHandler = new MicrocodeHandlerImm(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
                    break;
                case M.LD_FIRST:
                    microcodeHandler = new MicrocodeHandlerLdFirst(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
                    break;
                case M.LD_SECOND:
                    microcodeHandler = new MicrocodeHandlerLdSecond(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
                    break;
                case M.ST_FIRST_A:
                    microcodeHandler = new MicrocodeHandlerStFirstA(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
                    break;
                case M.ST_FIRST_B:
                    microcodeHandler = new MicrocodeHandlerStFirstB(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
                    break;
                case M.ST_FIRST_C:
                    microcodeHandler = new MicrocodeHandlerStFirstC(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
                    break;
                case M.ST_SECOND_A:
                    microcodeHandler = new MicrocodeHandlerStSecondA(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
                    break;
                case M.ST_SECOND_B:
                    microcodeHandler = new MicrocodeHandlerStSecondB(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
                    break;
                case M.ST_SECOND_C:
                    microcodeHandler = new MicrocodeHandlerStSecondC(
                        microcode, writeEnablePositive, writeEnableNegative, name
                    );
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
