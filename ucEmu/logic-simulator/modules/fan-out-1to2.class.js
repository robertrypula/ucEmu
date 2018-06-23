// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

var FanOut1To2;

FanOut1To2 = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.signalCollection.push(
        this.in = new Signal(this, simulator, 'in', 1, SignalRole.MODULE_INPUT, SignalOnChangeAction.UPDATE_MODULE),
        this.out1 = new Signal(this, simulator, 'out1', 1, SignalRole.MODULE_OUTPUT),
        this.out2 = new Signal(this, simulator, 'out2', 1, SignalRole.MODULE_OUTPUT)
    );
};

FanOut1To2.prototype = Object.create(AbstractModule.prototype);
FanOut1To2.prototype.constructor = FanOut1To2;

FanOut1To2.prototype.calculateOutputFromInput = function () {
    this.out1.setValue(this.in.getValue());
    this.out2.setValue(this.in.getValue());
};

FanOut1To2.prototype.getIn = function () {
    return this.in;
};

FanOut1To2.prototype.getOut1 = function () {
    return this.out1;
};

FanOut1To2.prototype.getOut2 = function () {
    return this.out2;
};
