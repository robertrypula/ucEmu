var MemoryController = (function () {
    'use strict';

    _MemoryController.$inject = [];

    function _MemoryController() {

        function getColumn(value) {
            return BitUtil.mask(value, BitUtil.BIT_2)
        }

        function getMemoryReadShiftedLeft(memoryRead, column) {
            // don't need to mask because JavaScript logic operators returns 32 bit long value
            return BitUtil.shiftLeft(memoryRead, column * BitUtil.BYTE_1);
        }

        function getMemoryReadShiftedRight(memoryRead, columnFromTheBack) {
            return BitUtil.shiftRight(memoryRead, columnFromTheBack * BitUtil.BYTE_1);
        }

        function getColumnFromTheBack(column) {
            return (4 - column);
        }

        function getMemoryReadFinal(memoryReadShifted, regMemoryBuffer) {
            return memoryReadShifted | regMemoryBuffer;
        }

        function getMemoryRowAddress(address) {
            return BitUtil.mask(
                BitUtil.shiftRight(address, BitUtil.BIT_2),
                BitUtil.BYTE_2 - BitUtil.BIT_2
            );
        }

        function getMemoryRowAddressNextRow(address) {
            // TODO check if this incrementation could be done in ALU
            return BitUtil.mask(
                this.getMemoryRowAddress(address) + 1,
                BitUtil.BYTE_2 - BitUtil.BIT_2
            );
        }

        function getWriteEnable(clock, writeEnablePositive, writeEnableNegative) {
            var
                writeEnableActive = writeEnablePositive || writeEnableNegative,
                result = writeEnableActive && ((clock && writeEnablePositive) || (!clock && writeEnableNegative));

            return result ? 1 : 0;
        }

        return {
            getColumn: getColumn,
            getMemoryReadShiftedLeft: getMemoryReadShiftedLeft,
            getMemoryReadShiftedRight: getMemoryReadShiftedRight,
            getColumnFromTheBack: getColumnFromTheBack,
            getMemoryReadFinal: getMemoryReadFinal,
            getMemoryRowAddress: getMemoryRowAddress,
            getMemoryRowAddressNextRow: getMemoryRowAddressNextRow,
            getWriteEnable: getWriteEnable
        };
    }

    return new _MemoryController();         // TODO change it to dependency injection
})();

