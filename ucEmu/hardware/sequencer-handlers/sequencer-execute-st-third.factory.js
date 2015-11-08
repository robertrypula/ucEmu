var SequencerExecuteStThird = (function () {
    'use strict';

    _SequencerExecuteStFirst.$inject = [];

    function _SequencerExecuteStFirst() {
        var SESF;

        SESF = function () {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SESF.prototype = Object.create(AbstractSequencerHandler.prototype);
        SESF.prototype.constructor = SESF;

        SESF.prototype.$$run = function () {

            console.log('    :: sequencerExecuteStFirst');
        };

        return SESF;
    }

    return _SequencerExecuteStFirst();        // TODO change it do dependency injection

})();
