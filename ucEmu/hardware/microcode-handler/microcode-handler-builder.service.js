var MicrocodeHandlerBuilder = (function () {
    'use strict';

    _MicrocodeHandlerBuilder.$inject = [];

    function _MicrocodeHandlerBuilder() {
        function build(microcode, memoryWEPositive, memoryWENegative, name) {
            var
                microcodeHandler = null,
                M = Microcode;

            switch (microcode) {
                case M.FETCH_FIRST:
                    microcodeHandler = new MicrocodeHandlerFetchFirst(
                        microcode, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.FETCH_SECOND_AND_DECODE:
                    microcodeHandler = new MicrocodeHandlerFetchSecondAndDecode(
                        microcode, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.ADD:
                    microcodeHandler = new MicrocodeHandlerAdd(
                        microcode, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.NAND:
                    microcodeHandler = new MicrocodeHandlerNand(
                        microcode, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.SH:
                    microcodeHandler = new MicrocodeHandlerSh(
                        microcode, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.JNZ:
                    microcodeHandler = new MicrocodeHandlerJnz(
                        microcode, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.COPY:
                    microcodeHandler = new MicrocodeHandlerCopy(
                        microcode, memoryWEPositive, memoryWENegative, name);
                    break;
                case M.IMM:
                    microcodeHandler = new MicrocodeHandlerImm(
                        microcode, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.LD_FIRST:
                    microcodeHandler = new MicrocodeHandlerLdFirst(
                        microcode, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.LD_SECOND:
                    microcodeHandler = new MicrocodeHandlerLdSecond(
                        microcode, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.ST_FIRST_A:
                    microcodeHandler = new MicrocodeHandlerStFirstA(
                        microcode, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.ST_FIRST_B:
                    microcodeHandler = new MicrocodeHandlerStFirstB(
                        microcode, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.ST_FIRST_C:
                    microcodeHandler = new MicrocodeHandlerStFirstC(
                        microcode, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.ST_SECOND_A:
                    microcodeHandler = new MicrocodeHandlerStSecondA(
                        microcode, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.ST_SECOND_B:
                    microcodeHandler = new MicrocodeHandlerStSecondB(
                        microcode, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.ST_SECOND_C:
                    microcodeHandler = new MicrocodeHandlerStSecondC(
                        microcode, memoryWEPositive, memoryWENegative, name
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
