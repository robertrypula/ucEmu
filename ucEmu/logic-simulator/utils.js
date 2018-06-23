// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

function _Util() {
    function shuffle(a) {
        var j, x, i;

        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }

    return {
        shuffle: shuffle
    }
}

var Util = new _Util();

// ---------------------------------------------------------------------------------------------------------------------

function _BitUtil() {
    function getMask(size) {
        var mask = 0xFFFFFFFF;   // 32 bits

        if (size <= 0 || size > 32) {
            throw 'Wrong bit size: ' + size;
        }

        mask = mask >>> (32 - size);

        return mask;
    }

    return {
        getMask: getMask
    }
}

var BitUtil = new _BitUtil();
