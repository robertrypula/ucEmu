var Logger = (function () {
    'use strict';

    _Logger.$inject = [];

    function _Logger() {

        function log(verbose, str) {
            console.log(str);
            
            for (var i = 0; i < verbose * 4; i++) {
                document.write("&nbsp;");
            }
            document.write(str + "<br>\n");
        }

        return {
            log: log
        };
    }

    return new _Logger();        // TODO change it do dependency injection

})();
