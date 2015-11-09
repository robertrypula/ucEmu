var SequencerExecuteStSecond = (function () {
    'use strict';

    _SequencerExecuteStSecond.$inject = [];

    function _SequencerExecuteStSecond() {
        var SESS;

        SESS = function () {
            AbstractSequencerHandler.apply(this, arguments);
        };

        SESS.prototype = Object.create(AbstractSequencerHandler.prototype);
        SESS.prototype.constructor = SESS;

        SESS.prototype.$$run = function () {

            console.log('    :: sequencerExecuteStSecond');
        };

        return SESS;
    }

    return _SequencerExecuteStSecond();        // TODO change it do dependency injection

})();
