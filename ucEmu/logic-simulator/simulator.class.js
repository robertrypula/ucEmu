// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

var Simulator;

Simulator = function () {
    AbstractSimulator.apply(this, arguments);

    this.moduleCollection.push(
        this.dLatch = new DLatch(this, this, 'dLatch'),
        this.signal = new High(this, this, 'signal'),
        this.fanOut = new FanOut1To3(this, this, 'fanout')
    );

    this.signal.getOut().connect(this.fanOut.getIn());
    this.fanOut.getOut1().connect(this.dLatch.getClock());
    this.fanOut.getOut2().connect(this.dLatch.getInput());

    this.initializate();
};

Simulator.prototype = Object.create(AbstractSimulator.prototype);
Simulator.prototype.constructor = Simulator;

Simulator.prototype.propagationLoop = function () {
    while (!this.allPropagated()) {
        console.log('Value: ' + this.dLatch.getQ().getValue() + ' ' + this.fanOut.getOut3().getValue());
        this.propagate();
    }
    console.log('Value: ' + this.dLatch.getQ().getValue() + ' ' + this.fanOut.getOut3().getValue());
    console.log('--');
};

Simulator.prototype.run = function () {
    console.log(this);
    this.propagationLoop();
    console.log(this);

    return;
    this.dLatch.getInput().setValue(1);
    this.dLatch.getClock().setValue(1);
    this.propagationLoop();

    this.dLatch.getInput().setValue(0);
    this.propagationLoop();

    this.dLatch.getClock().setValue(0);
    this.propagationLoop();

    this.dLatch.getInput().setValue(1);
    this.propagationLoop();

    this.dLatch.getInput().setValue(1);
    this.dLatch.getClock().setValue(1);
    this.propagationLoop();
};
