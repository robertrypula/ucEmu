var SequencerExecuteStFourth = (function () {
    'use strict';

    var SequencerExecuteStFourth = function () {
        var
            self = this,
            cpu = null
        ;

        self.run = function () {
          
            checkCpu();

            console.log('    :: sequencerExecuteStFourth');
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

    return SequencerExecuteStFourth;        // TODO change it do dependency injection

})();
