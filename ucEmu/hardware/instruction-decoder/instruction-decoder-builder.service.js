var InstructionDecoderBuilder = (function () {
    'use strict';

    _InstructionDecoderBuilder.$inject = [];

    function _InstructionDecoderBuilder() {
       
        function build(cpu) {
            return new InstructionDecoder(cpu);
        }

        return {
            build: build
        };
    }

    return new _InstructionDecoderBuilder();        // TODO change it to dependency injection

})();
