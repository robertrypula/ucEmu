var RxStateMachineBuilder = (function () {
    'use strict';

    _RxStateMachineBuilder.$inject = [];

    function _RxStateMachineBuilder() {

        function build(handlerIdleInit, handlerFirstSyncWait, handlerSignalInit, handlerFatalError, handlerIdle, handlerSymbol, handlerSync, handlerGuard, handlerError) {
            return new RxStateMachine(
                handlerIdleInit,
                handlerFirstSyncWait,
                handlerSignalInit,
                handlerFatalError,
                handlerIdle,
                handlerSymbol,
                handlerSync,
                handlerGuard,
                handlerError
            );
        }

        return {
            build: build
        };
    }

    return new _RxStateMachineBuilder();        // TODO change it to dependency injection

})();
