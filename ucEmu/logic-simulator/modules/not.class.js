// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

var Not;

Not = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.propagationDelayInitial = 10;
    this.moduleGiveSignal = true;

    this.signalCollection.push(
        this.in = new Signal(this, simulator, 'in', 1, SignalRole.MODULE_INPUT, SignalOnChangeAction.UPDATE_MODULE),
        this.out = new Signal(this, simulator, 'out', 1, SignalRole.MODULE_OUTPUT)
    );
};

Not.prototype = Object.create(AbstractModule.prototype);
Not.prototype.constructor = Not;

Not.prototype.calculateOutputFromInput = function () {
    if (this.in.getValue()) {
        this.out.setValue(0);
    } else {
        this.out.setValue(1);
    }
};

Not.prototype.getIn = function () {
    return this.in;
};

Not.prototype.getOut = function () {
    return this.out;
};
