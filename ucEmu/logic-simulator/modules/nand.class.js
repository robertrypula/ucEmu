// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

var Nand;

Nand = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.propagationDelayInitial = 10;
    this.moduleGiveSignal = true;

    this.signalCollection.push(
        this.inA = new Signal(this, simulator, 'inA', 1, SignalRole.MODULE_INPUT, SignalOnChangeAction.UPDATE_MODULE),
        this.inB = new Signal(this, simulator, 'inB', 1, SignalRole.MODULE_INPUT, SignalOnChangeAction.UPDATE_MODULE),
        this.out = new Signal(this, simulator, 'out', 1, SignalRole.MODULE_OUTPUT)
    );
};

Nand.prototype = Object.create(AbstractModule.prototype);
Nand.prototype.constructor = Nand;

Nand.prototype.calculateOutputFromInput = function () {
    if (!(this.inA.getValue() && this.inB.getValue())) {
        this.out.setValue(1);
    } else {
        this.out.setValue(0);
    }
};

Nand.prototype.getInA = function () {
    return this.inA;
};

Nand.prototype.getInB = function () {
    return this.inB;
};

Nand.prototype.getOut = function () {
    return this.out;
};
