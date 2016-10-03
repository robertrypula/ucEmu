var BitSize = (function () {
    'use strict';

    _BitSize.$inject = [];

    function _BitSize() {
        var
            register = BitUtil.BYTE_2,
            bitPerAddressRowOffset = 2;

        return {
            ADDRESS_ROW: register - bitPerAddressRowOffset,
            ADDRESS_ROW_OFFSET: bitPerAddressRowOffset,
            REGISTER: register,
            SINGLE_BIT: BitUtil.BIT_1,
            SEQUENCER: BitUtil.BYTE_HALF,
            MEMORY_WIDTH: BitUtil.BYTE_4,
            MEMORY_COLUMN: BitUtil.BYTE_1
    };
    }

    return new _BitSize();        // TODO change it to dependency injection

})();
