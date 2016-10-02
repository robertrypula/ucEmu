 var AbstractMicrocode = (function () {
    'use strict';

    _AbstractMicrocode.$inject = [];

    function _AbstractMicrocode() {
        var AM;

        AM = function (microcode) {
            this.microcode = microcode;
        };

        return AM;
    }

    return _AbstractMicrocode();        // TODO change it to dependency injection

})();
