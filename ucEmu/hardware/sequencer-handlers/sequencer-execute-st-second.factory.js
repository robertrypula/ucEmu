var SequencerExecuteStSecond = (function () {
    'use strict';

    var SequencerExecuteStSecond = function () {
        var
            self = this,
            cpu = null
        ;

        self.run = function () {
          
            checkCpu();

            console.log('    :: sequencerExecuteStSecond');
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

    return SequencerExecuteStSecond;        // TODO change it do dependency injection

})();
