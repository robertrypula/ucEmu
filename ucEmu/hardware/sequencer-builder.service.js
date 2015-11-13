var SequencerBuilder = (function () {
    'use strict';

    _SequencerBuilder.$inject = [];

    function _SequencerBuilder() {
       
        function build(cpu) {
            return new Sequencer(cpu);
        }

        return {
            build: build
        };
    }

    return new _SequencerBuilder();        // TODO change it do dependency injection

})();
