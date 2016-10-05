var InternalResultBag = (function () {
    'use strict';

    _InternalResultBag.$inject = [];

    function _InternalResultBag() {
        var IRB;

        IRB = function () {
            this.registerSaveIndex = undefined;
            this.register = undefined;

            this.sequencer = undefined;
            this.instruction = undefined;
            this.clockTick = undefined;
            this.memoryBuffer = undefined;
            this.memoryRowAddress = undefined;
            this.memoryWrite = undefined;

            this.writeEnable = undefined;
        };

        return IRB;
    }

    return _InternalResultBag();       // TODO change it to dependency injection

})();
