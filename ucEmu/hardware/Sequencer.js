var Sequencer = function () {

    var
        self = this,
        handlers = []
    ;

    self.STATES = {
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

    function construct()
    {
        handlers.push(
            { state: self.STATES.FETCH_FIRST, handler: null },
            { state: self.STATES.FETCH_SECOND_AND_DECODE, handler: null },
            { state: self.STATES.EXECUTE_ADD, handler: null },
            { state: self.STATES.EXECUTE_NAND, handler: null },
            { state: self.STATES.EXECUTE_SH, handler: null },
            { state: self.STATES.EXECUTE_JNZ, handler: null },
            { state: self.STATES.EXECUTE_COPY, handler: null },
            { state: self.STATES.EXECUTE_IMM, handler: null },
            { state: self.STATES.EXECUTE_LD_FIRST, handler: null },
            { state: self.STATES.EXECUTE_LD_SECOND, handler: null },
            { state: self.STATES.EXECUTE_ST_FIRST, handler: null },
            { state: self.STATES.EXECUTE_ST_SECOND, handler: null },
            { state: self.STATES.EXECUTE_ST_THIRD, handler: null },
            { state: self.STATES.EXECUTE_ST_FOURTH, handler: null }
        );
    }

    function checkState(state, method)
    {
        if (state < 0 || state >= self.STATES.length) {
            throw 'Sequencer.' + method + '() - bad state: ' + state;
        }
    }

    self.dispatch = function (regSequencer) {
        var state = regSequencer;

        checkState(state, 'dispatch');
        if (typeof handlers[state].handler === 'function') {
            handlers[state].handler();
        } else {
            throw 'Sequencer.dispatch() - handler is not a function for state: ' + state;
        }
    };

    construct();
};