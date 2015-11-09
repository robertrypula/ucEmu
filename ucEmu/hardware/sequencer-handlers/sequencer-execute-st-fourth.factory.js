var SequencerExecuteStFourth = (function () {
    'use strict';

    _SequencerExecuteStFourth.$inject = [];

    function _SequencerExecuteStFourth() {
        var SESF;

        SESF = function () {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SESF.prototype = Object.create(AbstractSequencerHandler.prototype);
        SESF.prototype.constructor = SESF;

        SESF.prototype.$$run = function () {

            console.log('    :: sequencerExecuteStFourth');
        };

        return SESF;
    }

    return _SequencerExecuteStFourth();        // TODO change it do dependency injection

})();
