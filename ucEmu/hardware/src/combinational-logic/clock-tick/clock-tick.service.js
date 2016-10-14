var ClockTick = (function () {
    'use strict';

    _ClockTick.$inject = [];

    function _ClockTick() {
        function getClockTickNext(regClockTick) {
            return BitUtil.mask(regClockTick + 1, CpuBitSize.MEMORY_WIDTH);
        }

        return {
            getClockTickNext: getClockTickNext
        };
    }

    return new _ClockTick();        // TODO change it to dependency injection

})();
