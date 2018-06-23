// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

var FlipFlopSR;

FlipFlopSR = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.moduleCollection.push(
        this.nandQ = new Nand(this, simulator, 'nandQ'),
        this.nandNotQ = new Nand(this, simulator, 'nandNotQ')
    );

    this.nandQ.getOut().connect(this.nandNotQ.getInA());
    this.nandNotQ.getOut().connect(this.nandQ.getInB());
};

FlipFlopSR.prototype = Object.create(AbstractModule.prototype);
FlipFlopSR.prototype.constructor = FlipFlopSR;

FlipFlopSR.prototype.getNandQ = function () {
    return this.nandQ;
};

FlipFlopSR.prototype.getNandNotQ = function () {
    return this.nandNotQ;
};

FlipFlopSR.prototype.getNotSet = function () {
    return this.nandQ.getInA();
};

FlipFlopSR.prototype.getNotReset = function () {
    return this.nandNotQ.getInB();
};

FlipFlopSR.prototype.getQ = function () {
    return this.nandQ.getOut();
};
