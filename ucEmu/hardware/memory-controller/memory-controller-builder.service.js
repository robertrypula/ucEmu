var MemoryControllerBuilder = (function () {
    'use strict';

    _MemoryControllerBuilder.$inject = [];

    function _MemoryControllerBuilder() {
       
        function build(cpu) {
            return new MemoryController(cpu);
        }

        return {
            build: build
        };
    }

    return new _MemoryControllerBuilder();        // TODO change it to dependency injection

})();
