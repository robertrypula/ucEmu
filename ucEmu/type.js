var ASCII_a = String(' ').charCodeAt(0);

var _b = function(value) {
    return value & 0xFF;
};

var _w = function(value) {
    return value & 0xFFFFFF;
};

var _ = {
    Word: function(value) {
        return 0xFFFFFF & value;
    },
    WordArray: function(n, val) {
        var r = [];

        if (typeof n === 'undefined') {
            n = val.length;

            if (typeof val === 'string') 
        }


        if (val.length > n) {
            throw "Initialization data has bigger array length than variable dimension.";
        }

        for (var i = 0; i < n; i++) {
            if (i < val.length) {
                r.push(new Word(val[i]));
            } else {
                r.push(new Word(0));
            }
        }
        return r;
    }
}
