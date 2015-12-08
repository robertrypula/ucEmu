var AluBuilder = (function () {
    'use strict';

    _AluBuilder.$inject = [];

    function _AluBuilder() {
       
        function build() {
            return new Alu();
        }

        return {
            build: build
        };
    }

    return new _AluBuilder();        // TODO change it to dependency injection

})();
