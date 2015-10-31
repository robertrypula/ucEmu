var BitUtils = (function () {
    'use strict';

    _BitUtils.$inject = [];

    function _BitUtils() {

        function getMask(size) {
            var mask = 0xFFFFFFFF;   // 32 bits

            if (size <= 0 || size > 32) {
                throw 'Wrong bit size: ' + size;
            }

            mask = mask >>> (32 - size);

            return mask;
        }

        function getMaskOneBit(size) {
            var mask = 0x80000000;   // 32 bits

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
            return this.mask((~value) + 1, size);
        }

        return {
            BIT_1: 1,
            BIT_2: 2,
            BYTE_HALF: 4,
            BYTE_1: 8,
            BYTE_2: 16,
            BYTE_3: 24,
            BYTE_4: 32,
            mask: mask,
            maskOneBit: maskOneBit,
            random: random,
            shiftRight: shiftRight,
            shiftLeft: shiftLeft,
            invertSignU2: invertSignU2
        };
    }

    return new _BitUtils();        // TODO change it do dependency injection

})();
