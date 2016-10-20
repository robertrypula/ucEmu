var CpuBitSize = (function () {
    'use strict';

    _CpuBitSize.$inject = [];

    function _CpuBitSize() {
        var
            memoryWidth = BitUtil.BYTE_4,
            memoryColumnWidth = BitUtil.BYTE_1,
            word = BitUtil.BYTE_2,
            bitPerAddressRowOffset = 2;

        return {
            ADDRESS_ROW: word - bitPerAddressRowOffset,
            ADDRESS_ROW_OFFSET: bitPerAddressRowOffset,
            WORD: word,
            SINGLE_BIT: BitUtil.BIT_1,
            SEQUENCER: BitUtil.BYTE_HALF,
            MEMORY_WIDTH: memoryWidth,
            MEMORY_COLUMN_WIDTH: memoryColumnWidth,
            MEMORY_COLUMN_IN_ROW: memoryWidth / memoryColumnWidth      // TODO change to MEMORY_BYTE_PER_ROW
        };
    }

    return new _CpuBitSize();        // TODO change it to dependency injection

})();
