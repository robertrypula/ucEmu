var SequencerExecuteStThird = (function () {
    'use strict';

    var SequencerExecuteStThird = function () {
        var
            self = this,
            cpu = null
        ;

        self.run = function () {
          
            checkCpu();

            console.log('    :: sequencerExecuteStThird');
        };

        self.setCpu = function (cpuSelf)
        {
            cpu = cpuSelf;
        };

        function checkCpu()
        {
            if (cpu === null) {
                throw 'Please attach cpu first';
            }
        }
    };

    return SequencerExecuteStThird;        // TODO change it do dependency injection

})();
