var MicrocodeExecuteCopy = (function () {
    'use strict';

    _MicrocodeExecuteCopy.$inject = [];

    function _MicrocodeExecuteCopy() {
        var MEC;

        MEC = function (cpu) {
            AbstractMicrocode.apply(this, arguments);
        };

        MEC.prototype = Object.create(AbstractMicrocode.prototype);
        MEC.prototype.constructor = MEC;

        MEC.prototype.$$goToNextState = function () {
            var regOut, regIn0, regIn0Value;

            regOut = this.$$insDec.getRegOut();
            regIn0 = this.$$insDec.getRegIn0();
            regIn0Value = this.$$regSet.read(regIn0);

            if (Logger.isEnabled()) {
                Logger.log(2, ':: sequencerExecuteCopy');
                Logger.log(3, 'regOut, regIn0 <-> ' + regOut + ', ' + regIn0);
                Logger.log(3, 'regIn0Value = ' + BitUtils.hex(regIn0Value, BitUtils.BYTE_2) + " (COPY, save regIn0Value at regOut)");
            }

            this.$$reg.regSequencer = this.$$MICROCODE.FETCH_FIRST;
            this.$$regSet.save(regOut, regIn0Value);
        };

        return MEC;
    }

    return _MicrocodeExecuteCopy();        // TODO change it do dependency injection

})();
