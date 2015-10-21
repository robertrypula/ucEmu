var BitUtils = (function () {
    'use strict';

    var BitUtils = function () {
        var
            self = this
        ;

        function getMask(size) {
            var mask = 0xFFFFFFFF;   // 32 bits

            if (size <= 0 || size > 32) {
                throw 'Wrong bit size: ' + size;
            }

            mask = mask >>> (32 - size);

            return mask;
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

        return {
            getMask: getMask,
            mask: mask,
            random: random,
            shiftRight: shiftRight,
            shiftLeft: shiftLeft
        };
    };

    return BitUtils();        // TODO change it do dependency injection

})();
