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

        function getAddressRowAsWord(address) {
            // converts address into addressRow but width the same width as register (needed for alu)
            return BitUtil.shiftRight(address, CpuBitSize.ADDRESS_ROW_OFFSET);
        }

        function getAddressRowFromAddressRowAsWord(addressRowAsWord) {
            // change registerWidth wide signal into addressRowWidth wide signal
            return BitUtil.mask(
                addressRowAsWord,
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

        function getMemoryReadShiftedPhaseOne(addressByte, memoryRead) {
            var column = getColumn(addressByte);

            return getMemoryReadShiftedLeft(memoryRead, column);
        }

        function getMemoryReadShiftedPhaseTwo(addressByte, memoryRead, regMemoryBuffer) {
            var
                column = getColumn(addressByte),
                columnFromTheBack = getColumnFromTheBack(column),
                memoryReadShifted = getMemoryReadShiftedRight(memoryRead, columnFromTheBack),
                memoryReadFinal = getMemoryReadFinal(memoryReadShifted, regMemoryBuffer);

            return memoryReadFinal;
        }

        return {
            getMemoryRowAddress: getMemoryRowAddress,
            getAddressRowAsWord: getAddressRowAsWord,
            getAddressRowFromAddressRowAsWord: getAddressRowFromAddressRowAsWord,
            getMemoryWE: getMemoryWE,
            getRegisterResultFromMemoryReadFinal: getRegisterResultFromMemoryReadFinal,
            getMemoryReadShiftedPhaseOne: getMemoryReadShiftedPhaseOne,
            getMemoryReadShiftedPhaseTwo: getMemoryReadShiftedPhaseTwo
        };
    }

    return new _MemoryController();         // TODO change it to dependency injection
})();

