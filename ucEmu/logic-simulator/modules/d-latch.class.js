// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

var DLatch;

DLatch = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.moduleCollection.push(
        this.clockFanOut = new FanOut1To2(this, simulator, 'clockFanOut'),
        this.nandNotSet = new Nand(this, simulator, 'nandNotSet'),
        this.nandNotSetFanOut = new FanOut1To2(this, simulator, 'nandNotSetFanOut'),
        this.nandNotReset = new Nand(this, simulator, 'nandNotReset'),
        this.flipFlopSR = new FlipFlopSR(this, simulator, 'flipFlopSR')
    );

    this.clockFanOut.getOut1().connect(this.nandNotSet.getInB());
    this.clockFanOut.getOut2().connect(this.nandNotReset.getInB());

    this.nandNotSet.getOut().connect(this.nandNotSetFanOut.getIn());
    this.nandNotSetFanOut.getOut1().connect(this.flipFlopSR.getNotSet());
    this.nandNotSetFanOut.getOut2().connect(this.nandNotReset.getInA());

    this.nandNotReset.getOut().connect(this.flipFlopSR.getNotReset());
};

DLatch.prototype = Object.create(AbstractModule.prototype);
DLatch.prototype.constructor = DLatch;

DLatch.prototype.getClockFanOut = function () {
    return this.clockFanOut;
};

DLatch.prototype.getFlipFlopSR = function () {
    return this.flipFlopSR;
};

DLatch.prototype.getNandNotSet = function () {
    return this.nandNotSet;
};

DLatch.prototype.getNandNotSetFanOut = function () {
    return this.nandNotSetFanOut;
};

DLatch.prototype.getNandNotReset = function () {
    return this.nandNotReset;
};

DLatch.prototype.getInput = function () {
    return this.nandNotSet.getInA();
};

DLatch.prototype.getClock = function () {
    return this.clockFanOut.getIn();
};

DLatch.prototype.getQ = function () {
    return this.flipFlopSR.getQ();
};
