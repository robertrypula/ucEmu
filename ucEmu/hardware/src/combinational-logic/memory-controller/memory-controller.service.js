var MemoryController = (function () {
    'use strict';

    _MemoryController.$inject = [];

    function _MemoryController() {

        function $$getColumn(value) {
            return BitUtil.mask(value, CpuBitSize.ADDRESS_ROW_OFFSET);
        }

        function $$getMemoryReadShiftedLeft(memoryRead, column) {
            // don't need to mask because JavaScript logic operators returns 32 bit long value
            return BitUtil.shiftLeft(memoryRead, column * CpuBitSize.MEMORY_COLUMN_WIDTH);
        }

        function $$getMemoryReadShiftedRight(memoryRead, columnFromTheBack) {
            return BitUtil.shiftRight(memoryRead, columnFromTheBack * CpuBitSize.MEMORY_COLUMN_WIDTH);
        }

        function $$getColumnFromTheBack(column) {
            return CpuBitSize.MEMORY_COLUMN_IN_ROW - column;
        }

        function $$getMemoryReadFinal(memoryReadShifted, regMemoryBuffer) {
            return memoryReadShifted | regMemoryBuffer;
        }

        function getAddressRow(addressByte) {
            return BitUtil.mask(
                BitUtil.shiftRight(addressByte, CpuBitSize.ADDRESS_ROW_OFFSET),
                CpuBitSize.ADDRESS_ROW
            );
        }

        function getAddressRowAsWord(addressByte) {
            // converts addressByte into addressRow but width the same width as register (needed for alu)
            return BitUtil.mask(
                BitUtil.shiftRight(addressByte, CpuBitSize.ADDRESS_ROW_OFFSET),
                CpuBitSize.WORD
            );
        }

        function getAddressByteFromAddressRowAsWord(addressRowAsWord) {
            return BitUtil.mask(
                BitUtil.shiftLeft(addressRowAsWord, CpuBitSize.ADDRESS_ROW_OFFSET),
                CpuBitSize.WORD
            );
        }

        function getMemoryWE(clock, memoryWEPositive, memoryWENegative) {
            var
                memoryWEActive = memoryWEPositive || memoryWENegative,
                result = memoryWEActive && ((clock && memoryWEPositive) || (!clock && memoryWENegative));

            return result ? 1 : 0;
        }

        function getWordFromMemoryReadFinal(memoryReadFinal) {
            return BitUtil.shiftRight(memoryReadFinal, 2 * CpuBitSize.MEMORY_COLUMN_WIDTH);  // TODO verify that
        }

        function getMemoryReadShiftedPhaseOne(addressByte, memoryRead) {
            var column = $$getColumn(addressByte);

            return $$getMemoryReadShiftedLeft(memoryRead, column);
        }

        function getMemoryReadShiftedPhaseTwo(addressByte, memoryRead, regMemoryBuffer) {
            var
                column = $$getColumn(addressByte),
                columnFromTheBack = $$getColumnFromTheBack(column),
                memoryReadShifted = $$getMemoryReadShiftedRight(memoryRead, columnFromTheBack),
                memoryReadFinal = $$getMemoryReadFinal(memoryReadShifted, regMemoryBuffer);

            return memoryReadFinal;
        }

        return {
            getAddressRow: getAddressRow,
            getAddressRowAsWord: getAddressRowAsWord,
            getAddressByteFromAddressRowAsWord: getAddressByteFromAddressRowAsWord,
            getMemoryWE: getMemoryWE,
            getWordFromMemoryReadFinal: getWordFromMemoryReadFinal,
            getMemoryReadShiftedPhaseOne: getMemoryReadShiftedPhaseOne,
            getMemoryReadShiftedPhaseTwo: getMemoryReadShiftedPhaseTwo
        };
    }

    return new _MemoryController();         // TODO change it to dependency injection
})();

