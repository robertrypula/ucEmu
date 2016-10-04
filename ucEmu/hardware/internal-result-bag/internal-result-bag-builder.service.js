var InternalResultBagBuilder = (function () {
    'use strict';

    _InternalResultBagBuilder.$inject = [];

    function _InternalResultBagBuilder() {
       
        function build() {
            return new InternalResultBag();
        }

        return {
            build: build
        };
    }

    return new _InternalResultBagBuilder();        // TODO change it to dependency injection

})();
