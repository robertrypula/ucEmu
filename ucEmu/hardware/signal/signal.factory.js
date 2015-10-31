var Signal = (function () {
    'use strict';

    _Signal.$inject = [
        'DiOne',
        'DiTwo'
    ];

    function _Signal(DiOne, DiTwo) {
        var C;

        C = function () {
            this.publicField = 'publicField';
        };

        C.prototype.method = function () {
            
        }

        return C;
    };

    return _Signal();       // TODO change it to DI

})();


/*

http://jsfiddle.net/t72ywvkv/


---------------------

prototype.constructor explained:
    http://stackoverflow.com/questions/8453887/why-is-it-necessary-to-set-the-prototype-constructor

};
*/