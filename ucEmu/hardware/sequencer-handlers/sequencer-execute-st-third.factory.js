var SequencerExecuteStThird = (function () {
    'use strict';

    _SequencerExecuteStThird.$inject = [];

    function _SequencerExecuteStThird() {
        var SEST;

        SEST = function () {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SEST.prototype = Object.create(AbstractSequencerHandler.prototype);
        SEST.prototype.constructor = SEST;

        SEST.prototype.$$goToNextState = function () {

            console.log('    :: sequencerExecuteStThird');
        };

        return SEST;
    }

    return _SequencerExecuteStThird();        // TODO change it do dependency injection

})();
