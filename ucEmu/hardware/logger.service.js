var Logger = (function () {
    'use strict';

    _Logger.$inject = [];

    function _Logger() {

        function log(verbose, str) {
            console.log(str);
        }

        return {
            log: log
        };
    }

    return new _Logger();        // TODO change it do dependency injection

})();
