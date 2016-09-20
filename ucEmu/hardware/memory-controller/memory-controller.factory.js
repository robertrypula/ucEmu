var MemoryController = (function () {
    'use strict';

    _MemoryController.$inject = [];

    function _MemoryController() {
        var MC;

        MC = function (cpu) {
            CpuAware.apply(this, arguments);

        };

        MC.prototype = Object.create(CpuAware.prototype);
        MC.prototype.constructor = MC;

        MC.prototype.getColumn = function (value) {
            return BitUtil.mask(value, BitUtil.BIT_2)
        };

        MC.prototype.getMemoryReadShiftedLeft = function (memoryColumn) {
            return BitUtil.shiftLeft(this.$$cpu.input.memoryRead, memoryColumn * BitUtil.BYTE_1);
        };

        MC.prototype.getRightShiftAmount = function (memoryColumn) {
            return (4 - memoryColumn) * BitUtil.BYTE_1;
        };

        return MC;
    }

    return _MemoryController();         // TODO change it to dependency injection
})();

