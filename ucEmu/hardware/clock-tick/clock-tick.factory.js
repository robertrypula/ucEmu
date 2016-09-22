var ClockTick = (function () {
    'use strict';

    _ClockTick.$inject = [];

    function _ClockTick() {
        var CC;

        CC = function (cpu) {
            CpuAware.apply(this, arguments);
        };

        CC.prototype = Object.create(CpuAware.prototype);
        CC.prototype.constructor = CC;

        CC.prototype.getClockTickNext = function () {
            return BitUtil.mask(
                this.$$cpu.core.regClockTick + 1,
                BitUtil.BYTE_4
            );
        };

        return CC;
    }

    return _ClockTick();        // TODO change it to dependency injection

})();
