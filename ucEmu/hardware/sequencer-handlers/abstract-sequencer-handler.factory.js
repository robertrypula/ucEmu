var AbstractSequencerHandler = (function () {
    'use strict';

    _AbstractSequencerHandler.$inject = [];

    function _AbstractSequencerHandler() {
        var ASH;

        ASH = function () {
            CpuAware.apply(this, arguments);
        };

        ASH.prototype = Object.create(CpuAware.prototype);
        ASH.prototype.constructor = ASH;

        ASH.prototype.run = function () {
            this.$$checkCpu();
            this.$$run();               // polymorphic call TODO change name of method
        }

        ASH.prototype.$$run = function () {
            throw 'Abstract method called!';
        };

        return ASH;
    }

    return _AbstractSequencerHandler();        // TODO change it do dependency injection

})();
