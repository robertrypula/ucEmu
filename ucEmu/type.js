var a = 2;
var arr = $([ 
    $.BYTE(1), 32, 43, $.WORD01, 32232, 423423, "some text", $.WORD32
]);

{ <byteFill[23]> }


function test(arrPtr)
{
    var t;

    t = $('*', arrPtr, 23);
}

$('&', arr);                      //   ?? = &arr
$('*', arrPtr, 23);               //   ?? = *(arrPtr + 23);
$('[]', arr, 2);                  //   ?? = arr[2];

$('*=', arrPtr, 23, val);         //   *(arrPtr + 23) = val;
$('[]=', arr, 2, val);            //   arr[2] = val;




var $ = function(a, b, c, d) {

    this.BYTE = function(v) {
        return 0x20000000 + v;
    };

    this.WORD = function(v) {
        return 0x40000000 + v;
    };

    if (typeof(a) === 'string') {
        switch (a) {
            case '&': 
                return address(b);
                break;
            case '*': 
                return indirect(b);
                break;
            case '[]': 
                return arrayAccess(b, c);
                break;
            case '*=': 
                return indirectAssign(b, c, d);
                break;
            case '[]=': 
                return arrayAccessAssign(b, c, d);
                break;
        }

        throw "Array, address or indirect operator error.";
    }

    function 
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
