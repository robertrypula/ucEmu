var BitUtil = (function () {
    'use strict';

    _BitUtil.$inject = [];

    function _BitUtil() {

        function getMask(size) {
            var mask = 0xFFFFFFFF;   // 32 bits

            if (size <= 0 || size > 32) {
                throw 'Wrong bit size: ' + size;
            }

            mask = mask >>> (32 - size);

            return mask;
        }

        function getMaskOneBit(size) {
            var mask = 0x80000000;   // one at most left position

            if (size <= 0 || size > 32) {
                throw 'Wrong bit size: ' + size;
            }

            mask = mask >>> (32 - size);

            return mask;
        }

        function maskOneBit(value, size) {
            return value & getMaskOneBit(size) ? true : false;
        }

        function mask(value, size) {
            return value & getMask(size);
        }

        function random(size) {
            var mask = getMask(size);

            return (Math.random() * (mask + 1)) & mask;
        }

        function shiftRight(value, size) {
            if (size < 0) {
                throw 'Negative shift size: ' + size;
            }

            return size < 32 
                ? value >>> size 
                : 0
            ;
        }

        function shiftLeft(value, size) {
            if (size < 0) {
                throw 'Negative shift size: ' + size;
            }

            return size < 32 
                ? value << size 
                : 0
            ;
        }

        function invertSignU2(value, size) {
            return mask((~value) + 1, size);
        }

        function hex(value, size) {
            var byteHalfMask, txt = '';

            value = mask(value, size);
            for (var i = Math.ceil(size / 4) - 1; i >= 0; i--) {
                byteHalfMask = 0xF << (i * 4);
                txt += ((value & byteHalfMask) >>> (i * 4)).toString(16);

                if (i % 2 === 0 && i != 0) {
                    txt += ' ';
                }
            }

            return txt;
        }

        function byteRowTo32bit(byteRow) {
            if (byteRow.length !== 4) {
                throw 'Byte row should always contain four bytes';
            }

            return (
                mask(byteRow[0], 8) * 0x1000000 +
                mask(byteRow[1], 8) * 0x10000 +
                mask(byteRow[2], 8) * 0x100 +
                mask(byteRow[3], 8)
            );
        }

        return {
            BIT_1: 1,
            BIT_2: 2,
            BYTE_HALF: 4,
            BYTE_1: 8,
            BYTE_2: 16,
            BYTE_3: 24,
            BYTE_4: 32,
            SERIALIZE_RADIX: 16,
            mask: mask,
            maskOneBit: maskOneBit,
            random: random,
            shiftRight: shiftRight,
            shiftLeft: shiftLeft,
            invertSignU2: invertSignU2,
            hex: hex,
            byteRowTo32bit: byteRowTo32bit
        };
    }

    return new _BitUtil();        // TODO change it to dependency injection

})();
