var ControlUnitBuilder = (function () {
    'use strict';

    _ControlUnitBuilder.$inject = [];

    function _ControlUnitBuilder() {

        function build(registerBag) {
            return new ControlUnit(registerBag);
        }

        return {
            build: build
        };
    }

    return new _ControlUnitBuilder();        // TODO change it to dependency injection

})();
