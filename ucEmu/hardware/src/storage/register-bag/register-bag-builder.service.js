var RegisterBagBuilder = (function () {
    'use strict';

    _RegisterBagBuilder.$inject = [];

    function _RegisterBagBuilder() {
       
        function build() {
            return new RegisterBag();
        }

        return {
            build: build
        };
    }

    return new _RegisterBagBuilder();        // TODO change it to dependency injection

})();
