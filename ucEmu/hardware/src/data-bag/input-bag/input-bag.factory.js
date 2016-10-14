var InputBag = (function () {
    'use strict';

    _InputBag.$inject = [];

    function _InputBag() {
        var IB;

        IB = function () {
            this.clock = 0;
            this.reset = 0;
            this.memoryRead = 0;
        };

        return IB;
    }

    return _InputBag();       // TODO change it to dependency injection

})();
