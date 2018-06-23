// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

var FanOut1To3;

FanOut1To3 = function (parentModule, simulator) {
    FanOut1To2.apply(this, arguments);

    this.signalCollection.push(
        this.out3 = new Signal(this, simulator, 'out3', 1, SignalRole.MODULE_OUTPUT)
    );
};

FanOut1To3.prototype = Object.create(FanOut1To2.prototype);
FanOut1To3.prototype.constructor = FanOut1To3;

FanOut1To3.prototype.calculateOutputFromInput = function () {
    FanOut1To2.prototype.calculateOutputFromInput.call(this);
    this.out3.setValue(this.in.getValue());
};

FanOut1To3.prototype.getOut3 = function () {
    return this.out3;
};
