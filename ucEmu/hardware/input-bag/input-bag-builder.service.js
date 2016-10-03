var InputBagBuilder = (function () {
    'use strict';

    _InputBagBuilder.$inject = [];

    function _InputBagBuilder() {
       
        function build() {
            return new InputBag();
        }

        return {
            build: build
        };
    }

    return new _InputBagBuilder();        // TODO change it to dependency injection

})();
