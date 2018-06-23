// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

var Low;

Low = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.moduleGiveSignal = true;

    this.signalCollection.push(
        this.out = new Signal(this, simulator, 'out', 1, SignalRole.MODULE_OUTPUT)
    );
};

Low.prototype = Object.create(AbstractModule.prototype);
Low.prototype.constructor = Low;

Low.prototype.calculateOutputFromInput = function () {
    this.out.setValue(0);
};

Low.prototype.getOut = function () {
    return this.out;
};
