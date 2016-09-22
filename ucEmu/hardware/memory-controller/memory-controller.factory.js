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

        MC.prototype.getMemoryReadShiftedLeft = function (column) {
            // don't need to mask because JavaScript logic operators returns 32 bit long value
            return BitUtil.shiftLeft(this.$$cpu.input.memoryRead, column * BitUtil.BYTE_1);
        };

        MC.prototype.getMemoryReadShiftedRight = function (columnFromTheBack) {
            return BitUtil.shiftRight(this.$$cpu.input.memoryRead, columnFromTheBack * BitUtil.BYTE_1);
        };

        MC.prototype.getColumnFromTheBack = function (column) {
            return (4 - column);
        };

        MC.prototype.getMemoryReadFinal = function (memoryReadShifted) {
            return memoryReadShifted | this.$$cpu.core.regMemoryBuffer;
        };

        MC.prototype.getMemoryRowAddress = function (address) {
            return BitUtil.mask(
                BitUtil.shiftRight(address, BitUtil.BIT_2),
                BitUtil.BYTE_2 - BitUtil.BIT_2
            );
        };

        MC.prototype.getMemoryRowAddressNextRow = function (address) {
            return BitUtil.mask(
                this.getMemoryRowAddress(address) + 1,
                BitUtil.BYTE_2 - BitUtil.BIT_2
            );
        };

        return MC;
    }

    return _MemoryController();         // TODO change it to dependency injection
})();

