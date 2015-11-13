var CpuAware = (function () {
    'use strict';

    _CpuAware.$inject = [];

    function _CpuAware() {
        var CA;

        CA = function (cpu) {
            this.$$cpu = cpu;
        };

        CA.prototype.setCpu = function (cpu) {
            this.$$cpu = cpu;
        };

        CA.prototype.$$checkCpu = function () {
            if (!this.$$cpu) {
                throw 'Please attach cpu first';
            }
        };

        return CA;
    }

    return _CpuAware();        // TODO change it do dependency injection

})();
