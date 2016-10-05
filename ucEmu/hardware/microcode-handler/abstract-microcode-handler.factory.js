 var AbstractMicrocode = (function () {
    'use strict';

    _AbstractMicrocode.$inject = [];

    function _AbstractMicrocode() {
        var AM;

        AM = function (microcode, memoryWEPositive, memoryWENegative, name) {
            this.microcode = microcode;
            this.memoryWEPositive = memoryWEPositive;
            this.memoryWENegative = memoryWENegative;
            this.name = name;
        };

        return AM;
    }

    return _AbstractMicrocode();        // TODO change it to dependency injection

})();
