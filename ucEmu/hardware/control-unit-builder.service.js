var ControlUnitBuilder = (function () {
    'use strict';

    _ControlUnitBuilder.$inject = [];

    function _ControlUnitBuilder() {

        function build(cpu) {
            return new ControlUnit(cpu);
        }

        return {
            build: build
        };
    }

    return new _ControlUnitBuilder();        // TODO change it do dependency injection

})();
