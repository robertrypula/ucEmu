var RegisterSet = (function () {
    'use strict';

    var RegisterSet = function () {
        var
            REGISTERS_SIZE = 16,
            MASK = 0xFFFF,
            PROGRAM_COUNTER_INDEX = REGISTERS_SIZE - 1,
            MEMORY_ACCESS_INDEX = REGISTERS_SIZE - 2,
            self = this,
            registers = []
        ;

        function construct()
        {
            for (var i = 0; i < REGISTERS_SIZE; i++) {
                registers.push(
                    MASK & (Math.random() * (MASK + 1))        // TODO move it to utilities service
                );
            }
        }

        function checkRange(number, method)
        {
            if (number < 0 || number >= REGISTERS_SIZE) {
                throw 'RegisterSet.' + method + '() - bad register number: ' + number;
            }
        }

        self.reset = function () {
            for (var i = 0; i < REGISTERS_SIZE; i++) {
                self.save(i, 0);
            }
        };

        self.getProgramCounter = function () {
            return self.read(PROGRAM_COUNTER_INDEX);
        };

        self.getMemoryAccess = function () {
            return self.read(MEMORY_ACCESS_INDEX);
        };

        self.setProgramCounter = function (value) {
            self.save(PROGRAM_COUNTER_INDEX, value);
        };

        self.setMemoryAccess = function (value) {
            self.save(MEMORY_ACCESS_INDEX, value);
        };

        self.read = function (number) {
            checkRange(number, 'read');

            return registers[number];
        };

        self.save = function (number, value) {
            checkRange(number, 'save');
            registers[number] = value & MASK;
        };

        construct();
    };

    return RegisterSet;       // TODO change it to DI

})();
