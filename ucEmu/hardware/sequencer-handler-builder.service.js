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
        'SequencerExecuteStFirst',
        'SequencerExecuteStSecond',
        'SequencerExecuteStThird',
        'SequencerExecuteStFourth'
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
            EXECUTE_ST_FIRST: 10,
            EXECUTE_ST_SECOND: 11,
            EXECUTE_ST_THIRD: 12,
            EXECUTE_ST_FOURTH: 13
        };

        function build(state, cpu) {
            var handler = null;

            switch (state) {
                case STATE.FETCH_FIRST:
                    handler = new SequencerFetchFirst();
                    break;
                case STATE.FETCH_SECOND_AND_DECODE:
                    handler = new SequencerFetchSecondAndDecode();
                    break;
                case STATE.EXECUTE_ADD:
                    handler = new SequencerExecuteAdd();
                    break;
                case STATE.EXECUTE_NAND:
                    handler = new SequencerExecuteNand();
                    break;
                case STATE.EXECUTE_SH:
                    handler = new SequencerExecuteSh();
                    break;
                case STATE.EXECUTE_JNZ:
                    handler = new SequencerExecuteJnz();
                    break;
                case STATE.EXECUTE_COPY:
                    handler = new SequencerExecuteCopy();
                    break;
                case STATE.EXECUTE_IMM:
                    handler = new SequencerExecuteImm();
                    break;
                case STATE.EXECUTE_LD_FIRST:
                    handler = new SequencerExecuteLdFirst();
                    break;
                case STATE.EXECUTE_LD_SECOND:
                    handler = new SequencerExecuteLdSecond();
                    break;
                case STATE.EXECUTE_ST_FIRST:
                    handler = new SequencerExecuteStFirst();
                    break;
                case STATE.EXECUTE_ST_SECOND:
                    handler = new SequencerExecuteStSecond();
                    break;
                case STATE.EXECUTE_ST_THIRD:
                    handler = new SequencerExecuteStThird();
                    break;
                case STATE.EXECUTE_ST_FOURTH:
                    handler = new SequencerExecuteStFourth();
                    break;
            }

            if (!handler) {
                throw 'Cannot build handler for state: ' + state;
            }

            handler.setCpu(cpu);

            return handler;
        }

        return {
            STATE: STATE,
            build: build
        };
    }

    return new _SequencerHandlerBuilder();        // TODO change it do dependency injection

})();
