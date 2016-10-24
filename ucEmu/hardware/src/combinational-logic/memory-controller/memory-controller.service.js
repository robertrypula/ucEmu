var MemoryController = (function () {
    'use strict';

    _MemoryController.$inject = [];

    function _MemoryController() {

        function $$getColumn(value) {
            return BitUtil.mask(
                value,
                CpuBitSize.ADDRESS_ROW_OFFSET
            );
        }

        function $$columnShiftLeft(memoryRow, column) {
            return BitUtil.mask(
                BitUtil.shiftLeft(memoryRow, column * CpuBitSize.MEMORY_COLUMN_WIDTH),
                CpuBitSize.MEMORY_WIDTH
            );
        }

        function $$columnShiftRightZeroFill(memoryRow, column) {
            return BitUtil.mask(
                BitUtil.shiftRight(memoryRow, column * CpuBitSize.MEMORY_COLUMN_WIDTH),
                CpuBitSize.MEMORY_WIDTH
            );
        }

        function $$getColumnFromTheBack(column) {
            return CpuBitSize.MEMORY_COLUMN_IN_ROW - column;
        }

        function $$bitwiseOr(a, b) {
            return BitUtil.mask(
                a | b,
                CpuBitSize.MEMORY_WIDTH
            );
        }

        function getAddressRow(addressByte) {
            return BitUtil.mask(
                BitUtil.shiftRight(addressByte, CpuBitSize.ADDRESS_ROW_OFFSET),
                CpuBitSize.ADDRESS_ROW
            );
        }

        function getMemoryWE(clock, memoryWEPositive, memoryWENegative) {
            var
                memoryWEActive = memoryWEPositive || memoryWENegative,
                result = memoryWEActive && ((clock && memoryWEPositive) || (!clock && memoryWENegative));

            return result ? 1 : 0;
        }

        function getWordFromMemoryRead(memoryReadFinal) {
            return BitUtil.mask(
                BitUtil.shiftRight(memoryReadFinal, 2 * CpuBitSize.MEMORY_COLUMN_WIDTH),   // TODO verify that
                CpuBitSize.WORD
            );
        }

        function $$getMemoryRowFromWord(word) {
            return BitUtil.mask(
                BitUtil.shiftLeft(word, 2 * CpuBitSize.MEMORY_COLUMN_WIDTH),   // TODO verify that
                CpuBitSize.MEMORY_WIDTH
            );
        }

        function getMemoryReadPhaseOne(addressByte, memoryRead) {
            var column = $$getColumn(addressByte);

            return $$columnShiftLeft(memoryRead, column);
        }

        function getMemoryReadPhaseTwo(addressByte, memoryRead, regMemoryBuffer) {
            var
                column = $$getColumn(addressByte),
                columnFromTheBack = $$getColumnFromTheBack(column),
                shifted = $$columnShiftRightZeroFill(memoryRead, columnFromTheBack),
                result = $$bitwiseOr(shifted, regMemoryBuffer);

            return result;
        }

        /*
            0x12 0x34 0x56 0x78
            0x9a 0xbc 0xde 0xff
            Data to write 0x61 0x72
         */

        /*
         :: Phase one ::
            12 34 56 78   ram read  (row + 0)
            11 11 11 00   ram mask           (00 00 11 11 >> col, ones fill)
            12 34 56 00   ram read & ram mask

            00 00 00 61   dataWriteShifted   (dataWrite >> col, zeros fill)

            12 34 56 61   dataWriteShifted | (ram read & ram mask)

         */
        function getMemoryWritePhaseOne(addressByte, memoryRead, dataToWrite) {
            var
                mask = 0xFFFF0000,          // TODO move hardcoded value
                column = $$getColumn(addressByte),
                maskShifted = $$columnShiftRightZeroFill(mask, column),
                maskShiftedBitwiseNot = ~maskShifted,
                memoryReadMasked = memoryRead & maskShiftedBitwiseNot,
                dataToWriteAsMemoryRow = $$getMemoryRowFromWord(dataToWrite),
                dataToWriteAsMemoryRowShifted = $$columnShiftRightZeroFill(dataToWriteAsMemoryRow, column),
                result = memoryReadMasked | dataToWriteAsMemoryRowShifted;

            /*
            console.log('#1 mask', BitUtil.hex(mask, 32));
            console.log('#1 column', BitUtil.hex(column, 32));
            console.log('#1 maskShifted', BitUtil.hex(maskShifted, 32));
            console.log('#1 maskShiftedBitwiseNot', BitUtil.hex(maskShiftedBitwiseNot, 32));
            console.log('#1 memoryRead', BitUtil.hex(memoryRead, 32));
            console.log('#1 memoryReadMasked', BitUtil.hex(memoryReadMasked, 32));
            console.log('#1 dataToWrite', BitUtil.hex(dataToWrite, 32));
            console.log('#1 dataToWriteAsMemoryRow', BitUtil.hex(dataToWriteAsMemoryRow, 32));
            console.log('#1 dataToWriteAsMemoryRowShifted', BitUtil.hex(dataToWriteAsMemoryRowShifted, 32));
            console.log('#1 result', BitUtil.hex(result, 32));
            console.log('#1 ------------');
            */

            return BitUtil.mask(
                result,
                CpuBitSize.MEMORY_WIDTH
            );
        }

        /*
        :: Phase two ::
            9a bc de ff   ram read  (row + 1)
            00 11 11 11   ram mask           (00 00 11 11 << (4 - col), ones fill)
            00 bc de ff   ram read & ram mask

            72 00 00 00   dataWriteShifted   (dataWrite << (4 - col), zeros fill)

            72 bc de ff   dataWriteShifted | (ram read & ram mask)
         */
        function getMemoryWritePhaseTwo(addressByte, memoryRead, dataToWrite) {
            var
                mask = 0xFFFF0000,          // TODO move hardcoded value
                column = $$getColumn(addressByte),
                columnFromTheBack = $$getColumnFromTheBack(column),
                maskShifted = $$columnShiftLeft(mask, columnFromTheBack),
                maskShiftedBitwiseNot = ~maskShifted,
                memoryReadMasked = memoryRead & maskShiftedBitwiseNot,
                dataToWriteAsMemoryRow = $$getMemoryRowFromWord(dataToWrite),
                dataToWriteAsMemoryRowShifted = $$columnShiftLeft(dataToWriteAsMemoryRow, columnFromTheBack),
                result = memoryReadMasked | dataToWriteAsMemoryRowShifted;

            /*
            console.log('#2 mask', BitUtil.hex(mask, 32));
            console.log('#2 column', BitUtil.hex(column, 32));
            console.log('#2 maskShifted', BitUtil.hex(maskShifted, 32));
            console.log('#2 maskShiftedBitwiseNot', BitUtil.hex(maskShiftedBitwiseNot, 32));
            console.log('#2 memoryRead', BitUtil.hex(memoryRead, 32));
            console.log('#2 memoryReadMasked', BitUtil.hex(memoryReadMasked, 32));
            console.log('#2 dataToWrite', BitUtil.hex(dataToWrite, 32));
            console.log('#2 dataToWriteAsMemoryRow', BitUtil.hex(dataToWriteAsMemoryRow, 32));
            console.log('#2 dataToWriteAsMemoryRowShifted', BitUtil.hex(dataToWriteAsMemoryRowShifted, 32));
            console.log('#2 result', BitUtil.hex(result, 32));
            console.log('#2 ------------');
            */

            return BitUtil.mask(
                result,
                CpuBitSize.MEMORY_WIDTH
            );
        }

        return {
            getAddressRow: getAddressRow,
            getMemoryWE: getMemoryWE,
            getWordFromMemoryRead: getWordFromMemoryRead,
            getMemoryReadPhaseOne: getMemoryReadPhaseOne,
            getMemoryReadPhaseTwo: getMemoryReadPhaseTwo,
            getMemoryWritePhaseOne: getMemoryWritePhaseOne,
            getMemoryWritePhaseTwo: getMemoryWritePhaseTwo
        };
    }

    return new _MemoryController();         // TODO change it to dependency injection
})();

