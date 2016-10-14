var Logger = (function () {
    'use strict';

    _Logger.$inject = [];

    function _Logger() {
        var $$verbose = 0;

        function $$logHtml(verbose, str) {
            var strParsed, i, element;

            element = document.getElementById('output');
            for (i = 0; i < verbose * 1; i++) {
                element.innerHTML += '&nbsp;';
            }
            strParsed = str.replace(/\n/g, '<br/>');
            // strParsed = strParsed.replace(/ /g, '&nbsp;');
            element.innerHTML += strParsed + '<br/>';
        }

        function $$logConsole(str) {
            // console.log(str);
        }

        function log(verbose, str) {
            if (verbose > $$verbose) {
                return;
            }

            $$logHtml(verbose, str);          // very basic html logger
            $$logConsole(str);                // normal console logger
        }

        function setVerbose(verbose) {
            $$verbose = verbose;
        }

        function getVerbose() {
            return $$verbose;
        }

        function isEnabled() {
            return $$verbose >= 0;
        }

        function clear() {
            document.getElementById('output').innerHTML = '';
        }

        return {
            log: log,
            getVerbose: getVerbose,
            setVerbose: setVerbose,
            isEnabled: isEnabled,
            clear: clear
        };
    }

    return new _Logger();        // TODO change it to dependency injection

})();
