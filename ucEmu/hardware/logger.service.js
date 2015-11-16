var Logger = (function () {
    'use strict';

    _Logger.$inject = [];

    function _Logger() {
        var $$verbose = 0;

        function $$logHtml(verbose, str) {
            var strParsed, i;
            
            for (i = 0; i < verbose * 4; i++) {
                document.write("&nbsp;");
            }
            strParsed = str.replace(/\n/g, '<br/>');
            strParsed = str.replace(/ /g, '&nbsp;');
            document.write(strParsed + "<br/>");
        }

        function $$logConsole(str) {
            console.log(str);
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

        return {
            log: log,
            getVerbose: getVerbose,
            setVerbose: setVerbose
        };
    }

    return new _Logger();        // TODO change it do dependency injection

})();
