var ClockTickBuilder = (function () {
    'use strict';

    _ClockTickBuilder.$inject = [];

    function _ClockTickBuilder() {
       
        function build(cpu) {
            return new ClockTick(cpu);
        }

        return {
            build: build
        };
    }

    return new _ClockTickBuilder();        // TODO change it to dependency injection

})();
