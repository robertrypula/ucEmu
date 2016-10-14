var MemoryController = (function () {
    'use strict';

    _MemoryController.$inject = [];

    function _MemoryController() {

        function getColumn(value) {
            return BitUtil.mask(value, CpuBitSize.ADDRESS_ROW_OFFSET)
        }

        function getMemoryReadShiftedLeft(memoryRead, column) {
            // don't need to mask because JavaScript logic operators returns 32 bit long value
            return BitUtil.shiftLeft(memoryRead, column * CpuBitSize.MEMORY_COLUMN);
        }

        function getMemoryReadShiftedRight(memoryRead, columnFromTheBack) {
            return BitUtil.shiftRight(memoryRead, columnFromTheBack * CpuBitSize.MEMORY_COLUMN);
        }

        function getColumnFromTheBack(column) {
            var columnInRow = CpuBitSize.MEMORY_WIDTH / CpuBitSize.MEMORY_COLUMN;

            return columnInRow - column;
        }

        function getMemoryReadFinal(memoryReadShifted, regMemoryBuffer) {
            return memoryReadShifted | regMemoryBuffer;
        }

        function getMemoryRowAddress(address) {
            return BitUtil.mask(
                BitUtil.shiftRight(address, CpuBitSize.ADDRESS_ROW_OFFSET),
                CpuBitSize.ADDRESS_ROW
            );
        }

        function getMemoryRowAddressNextRow(address) {
            // TODO check if this incrementation could be done in ALU
            return BitUtil.mask(
                this.getMemoryRowAddress(address) + 1,
                CpuBitSize.ADDRESS_ROW
            );
        }

        function getAddressRowForAlu(address) {
            // converts address into addressRow but width the same width as register (needed for alu)
            return BitUtil.shiftRight(address, CpuBitSize.ADDRESS_ROW_OFFSET);
        }

        function getAddressRow(addressRowForAlu) {
            // change registerWidth wide signal into addressRowWidth wide signal
            return BitUtil.mask(
                addressRowForAlu,
                CpuBitSize.ADDRESS_ROW
            );
        }

        function getMemoryWE(clock, memoryWEPositive, memoryWENegative) {
            var
                memoryWEActive = memoryWEPositive || memoryWENegative,
                result = memoryWEActive && ((clock && memoryWEPositive) || (!clock && memoryWENegative));

            return result ? 1 : 0;
        }

        function getRegisterResultFromMemoryReadFinal(memoryReadFinal) {
            return BitUtil.shiftRight(memoryReadFinal, 2 * CpuBitSize.MEMORY_COLUMN);  // TODO verify that
        }

        return {
            getColumn: getColumn,
            getMemoryReadShiftedLeft: getMemoryReadShiftedLeft,
            getMemoryReadShiftedRight: getMemoryReadShiftedRight,
            getColumnFromTheBack: getColumnFromTheBack,
            getMemoryReadFinal: getMemoryReadFinal,
            getMemoryRowAddress: getMemoryRowAddress,
            getMemoryRowAddressNextRow: getMemoryRowAddressNextRow,
            getAddressRowForAlu: getAddressRowForAlu,
            getAddressRow: getAddressRow,
            getMemoryWE: getMemoryWE,
            getRegisterResultFromMemoryReadFinal: getRegisterResultFromMemoryReadFinal
        };
    }

    return new _MemoryController();         // TODO change it to dependency injection
})();

