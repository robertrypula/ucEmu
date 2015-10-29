var SignalFactory = (function () {
    'use strict';

    _SignalFactory.$inject = [
        'DiOne',
        'DiTwo'
    ];

    function _SignalFactory(DiOne, DiTwo) {
        var self = this;

        function create() {
            return new Signal();
        }

        return {
            create: create
        };
    };

    return new _SignalFactory();       // TODO change it to DI

})();
