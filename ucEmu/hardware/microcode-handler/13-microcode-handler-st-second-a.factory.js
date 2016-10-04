var MicrocodeHandlerStSecondA = (function () {
    'use strict';

    _MicrocodeHandlerStSecondA.$inject = [];

    function _MicrocodeHandlerStSecondA() {
        var MESSA;

        MESSA = function (microcode, writeEnablePositive, writeEnableNegative, name) {
            AbstractMicrocode.apply(this, arguments);
        };

        MESSA.prototype = Object.create(AbstractMicrocode.prototype);
        MESSA.prototype.constructor = MESSA;

        MESSA.prototype.finalizePropagationAndStoreResults = function (registerBag, inputBag, instruction, internalResultBag) {
            var reset;

            reset = registerBag.regReset;
            if (Logger.isEnabled()) {
                Logger.log(0, ':: [SIGNALS PROPAGATION FINISHED]');
                Logger.log(1, 'microcodeHandlerName = ' + this.name);
                Logger.log(1, 'instructionName = ' + instruction.name + ', ' + instruction.nameFull);
            }

            if (reset) {
                registerBag.resetAll();
            } else {
                registerBag.regClockTick = ClockTick.getClockTickNext(registerBag.regClockTick);
                registerBag.regSequencer = Microcode.ST_SECOND_B;
            }
            registerBag.regReset = inputBag.reset;
        };

        return MESSA;
    }

    return _MicrocodeHandlerStSecondA();        // TODO change it to dependency injection

})();
