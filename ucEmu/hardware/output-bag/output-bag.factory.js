var OutputBag = (function () {
    'use strict';

    _OutputBag.$inject = [];

    function _OutputBag() {
        var OB;

        OB = function () {
            this.memoryRowAddress = 0;
            this.memoryWrite = 0;
            this.memoryWE = 0;
        };

        return OB;
    }

    return _OutputBag();       // TODO change it to dependency injection

})();
