 var AbstractMicrocode = (function () {
    'use strict';

    _AbstractMicrocode.$inject = [];

    function _AbstractMicrocode() {
        var AM;

        AM = function (microcode, writeEnablePositive, writeEnableNegative, name) {
            this.microcode = microcode;
            this.writeEnablePositive = writeEnablePositive;
            this.writeEnableNegative = writeEnableNegative;
            this.name = name;
        };

        return AM;
    }

    return _AbstractMicrocode();        // TODO change it to dependency injection

})();
