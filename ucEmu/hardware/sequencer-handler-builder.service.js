var SequencerHandlerBuilder = (function () {
    'use strict';

    _SequencerHandlerBuilder.$inject = [
        'SequencerFetchFirst',
        'SequencerFetchSecondAndDecode',
        'SequencerExecuteAdd',
        'SequencerExecuteNand',
        'SequencerExecuteSh',
        'SequencerExecuteJnz',
        'SequencerExecuteCopy',
        'SequencerExecuteImm',
        'SequencerExecuteLdFirst',
        'SequencerExecuteLdSecond',
        'SequencerExecuteStFirstA',
        'SequencerExecuteStFirstB',
        'SequencerExecuteStFirstC',
        'SequencerExecuteStSecondA',
        'SequencerExecuteStSecondB',
        'SequencerExecuteStSecondC'
    ];

    function _SequencerHandlerBuilder() {
        var STATE = {
            FETCH_FIRST: 0,
            FETCH_SECOND_AND_DECODE: 1,
            EXECUTE_ADD: 2,
            EXECUTE_NAND: 3,
            EXECUTE_SH: 4,
            EXECUTE_JNZ: 5,
            EXECUTE_COPY: 6,
            EXECUTE_IMM: 7,
            EXECUTE_LD_FIRST: 8,
            EXECUTE_LD_SECOND: 9,
            EXECUTE_ST_FIRST_A: 10,
            EXECUTE_ST_FIRST_B: 11,
            EXECUTE_ST_FIRST_C: 12,
            EXECUTE_ST_SECOND_A: 13,
            EXECUTE_ST_SECOND_B: 14,
            EXECUTE_ST_SECOND_C: 15
        };

        function build(state, cpu) {
            var handler = null;

            switch (state) {
                case STATE.FETCH_FIRST:
                    handler = new SequencerFetchFirst(cpu);
                    break;
                case STATE.FETCH_SECOND_AND_DECODE:
                    handler = new SequencerFetchSecondAndDecode(cpu);
                    break;
                case STATE.EXECUTE_ADD:
                    handler = new SequencerExecuteAdd(cpu);
                    break;
                case STATE.EXECUTE_NAND:
                    handler = new SequencerExecuteNand(cpu);
                    break;
                case STATE.EXECUTE_SH:
                    handler = new SequencerExecuteSh(cpu);
                    break;
                case STATE.EXECUTE_JNZ:
                    handler = new SequencerExecuteJnz(cpu);
                    break;
                case STATE.EXECUTE_COPY:
                    handler = new SequencerExecuteCopy(cpu);
                    break;
                case STATE.EXECUTE_IMM:
                    handler = new SequencerExecuteImm(cpu);
                    break;
                case STATE.EXECUTE_LD_FIRST:
                    handler = new SequencerExecuteLdFirst(cpu);
                    break;
                case STATE.EXECUTE_LD_SECOND:
                    handler = new SequencerExecuteLdSecond(cpu);
                    break;
                case STATE.EXECUTE_ST_FIRST_A:
                    handler = new SequencerExecuteStFirstA(cpu);
                    break;
                case STATE.EXECUTE_ST_FIRST_B:
                    handler = new SequencerExecuteStFirstB(cpu);
                    break;
                case STATE.EXECUTE_ST_FIRST_C:
                    handler = new SequencerExecuteStFirstC(cpu);
                    break;
                case STATE.EXECUTE_ST_SECOND_A:
                    handler = new SequencerExecuteStSecondA(cpu);
                    break;
                case STATE.EXECUTE_ST_SECOND_B:
                    handler = new SequencerExecuteStSecondB(cpu);
                    break;
                case STATE.EXECUTE_ST_SECOND_C:
                    handler = new SequencerExecuteStSecondC(cpu);
                    break;
            }

            if (!handler) {
                throw 'Cannot build handler for state: ' + state;
            }

            return handler;
        }

        return {
            STATE: STATE,
            build: build
        };
    }

    return new _SequencerHandlerBuilder();        // TODO change it do dependency injection

})();
