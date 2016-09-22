var RegisterFileBuilder = (function () {
    'use strict';

    _RegisterFileBuilder.$inject = [];

    function _RegisterFileBuilder() {
       
        function build() {
            return new RegisterFile();
        }

        return {
            build: build
        };
    }

    return new _RegisterFileBuilder();        // TODO change it to dependency injection

})();
