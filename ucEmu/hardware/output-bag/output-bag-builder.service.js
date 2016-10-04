var OutputBagBuilder = (function () {
    'use strict';

    _OutputBagBuilder.$inject = [];

    function _OutputBagBuilder() {
       
        function build() {
            return new OutputBag();
        }

        return {
            build: build
        };
    }

    return new _OutputBagBuilder();        // TODO change it to dependency injection

})();
