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
        function build(state, cpu) {
            var handler = null;

            switch (state) {
                case Sequencer.MICROCODE.FETCH_FIRST:
                    handler = new SequencerFetchFirst(cpu);
                    break;
                case Sequencer.MICROCODE.FETCH_SECOND_AND_DECODE:
                    handler = new SequencerFetchSecondAndDecode(cpu);
                    break;
                case Sequencer.MICROCODE.EXECUTE_ADD:
                    handler = new SequencerExecuteAdd(cpu);
                    break;
                case Sequencer.MICROCODE.EXECUTE_NAND:
                    handler = new SequencerExecuteNand(cpu);
                    break;
                case Sequencer.MICROCODE.EXECUTE_SH:
                    handler = new SequencerExecuteSh(cpu);
                    break;
                case Sequencer.MICROCODE.EXECUTE_JNZ:
                    handler = new SequencerExecuteJnz(cpu);
                    break;
                case Sequencer.MICROCODE.EXECUTE_COPY:
                    handler = new SequencerExecuteCopy(cpu);
                    break;
                case Sequencer.MICROCODE.EXECUTE_IMM:
                    handler = new SequencerExecuteImm(cpu);
                    break;
                case Sequencer.MICROCODE.EXECUTE_LD_FIRST:
                    handler = new SequencerExecuteLdFirst(cpu);
                    break;
                case Sequencer.MICROCODE.EXECUTE_LD_SECOND:
                    handler = new SequencerExecuteLdSecond(cpu);
                    break;
                case Sequencer.MICROCODE.EXECUTE_ST_FIRST_A:
                    handler = new SequencerExecuteStFirstA(cpu);
                    break;
                case Sequencer.MICROCODE.EXECUTE_ST_FIRST_B:
                    handler = new SequencerExecuteStFirstB(cpu);
                    break;
                case Sequencer.MICROCODE.EXECUTE_ST_FIRST_C:
                    handler = new SequencerExecuteStFirstC(cpu);
                    break;
                case Sequencer.MICROCODE.EXECUTE_ST_SECOND_A:
                    handler = new SequencerExecuteStSecondA(cpu);
                    break;
                case Sequencer.MICROCODE.EXECUTE_ST_SECOND_B:
                    handler = new SequencerExecuteStSecondB(cpu);
                    break;
                case Sequencer.MICROCODE.EXECUTE_ST_SECOND_C:
                    handler = new SequencerExecuteStSecondC(cpu);
                    break;
            }

            if (!handler) {
                throw 'Cannot build handler for state: ' + state;
            }

            return handler;
        }

        return {
            build: build
        };
    }

    return new _SequencerHandlerBuilder();        // TODO change it do dependency injection

})();
