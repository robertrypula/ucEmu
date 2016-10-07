var MicrocodeHandlerBuilder = (function () {
    'use strict';

    _MicrocodeHandlerBuilder.$inject = [];

    function _MicrocodeHandlerBuilder() {
        function build(microcode, microcodeJump, memoryWEPositive, memoryWENegative, name) {
            var
                microcodeHandler = null,
                M = Microcode;

            switch (microcode) {
                case M.FETCH_FIRST:
                    microcodeHandler = new MicrocodeHandlerFetchFirst(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.FETCH_SECOND_AND_DECODE:
                    microcodeHandler = new MicrocodeHandlerFetchSecondAndDecode(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.ADD:
                    microcodeHandler = new MicrocodeHandlerAdd(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.NAND:
                    microcodeHandler = new MicrocodeHandlerNand(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.SH:
                    microcodeHandler = new MicrocodeHandlerSh(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.JZ:
                    microcodeHandler = new MicrocodeHandlerJz(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.COPY:
                    microcodeHandler = new MicrocodeHandlerCopy(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name);
                    break;
                case M.IMM:
                    microcodeHandler = new MicrocodeHandlerImm(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.LD_FIRST:
                    microcodeHandler = new MicrocodeHandlerLdFirst(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.LD_SECOND:
                    microcodeHandler = new MicrocodeHandlerLdSecond(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.ST_FIRST_A:
                    microcodeHandler = new MicrocodeHandlerStFirstA(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.ST_FIRST_B:
                    microcodeHandler = new MicrocodeHandlerStFirstB(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.ST_FIRST_C:
                    microcodeHandler = new MicrocodeHandlerStFirstC(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.ST_SECOND_A:
                    microcodeHandler = new MicrocodeHandlerStSecondA(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.ST_SECOND_B:
                    microcodeHandler = new MicrocodeHandlerStSecondB(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
                    );
                    break;
                case M.ST_SECOND_C:
                    microcodeHandler = new MicrocodeHandlerStSecondC(
                        microcode, microcodeJump, memoryWEPositive, memoryWENegative, name
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
