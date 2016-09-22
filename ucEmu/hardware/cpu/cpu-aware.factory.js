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

        return CA;
    }

    return _CpuAware();        // TODO change it to dependency injection

})();
