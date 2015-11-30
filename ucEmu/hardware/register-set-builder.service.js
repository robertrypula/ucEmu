var RegisterSetBuilder = (function () {
    'use strict';

    _RegisterSetBuilder.$inject = [];

    function _RegisterSetBuilder() {
       
        function build() {
            return new RegisterSet();
        }

        return {
            build: build
        };
    }

    return new _RegisterSetBuilder();        // TODO change it to dependency injection

})();
