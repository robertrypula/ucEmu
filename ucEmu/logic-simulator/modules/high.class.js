// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

var High;

High = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.moduleGiveSignal = true;

    this.signalCollection.push(
        this.out = new Signal(this, simulator, 'out', 1, SignalRole.MODULE_OUTPUT)
    );
};

High.prototype = Object.create(AbstractModule.prototype);
High.prototype.constructor = High;

High.prototype.calculateOutputFromInput = function () {
    this.out.setValue(1);
};

High.prototype.getOut = function () {
    return this.out;
};
