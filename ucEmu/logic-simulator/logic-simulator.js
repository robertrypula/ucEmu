/*
    - propagation counter will be on the update() call (update will return true/false)
    - refresh method at simulator

    simulator.getClock().toggle();
    while (!simulator.allPropagated()) {
        simulator.refresh();
    }
*/

// ---------------------------------------------------------------------------------------------------------------------

function _BitUtil() {
    function getMask(size) {
        var mask = 0xFFFFFFFF;   // 32 bits

        if (size <= 0 || size > 32) {
            throw 'Wrong bit size: ' + size;
        }

        mask = mask >>> (32 - size);

        return mask;
    }

    return {
        getMask: getMask
    }
}

var BitUtil = new _BitUtil();

// ---------------------------------------------------------------------------------------------------------------------

var Signal;

Signal = function (parentModule, simulator, width, isInput) {
    this.parentModule = parentModule;
    this.simulator = simulator;
    this.width = width;
    this.isInput = isInput;
    this.value = null;
    this.connectList = [];
    this.connected = 0;
};

Signal.CONNECTION_LIMIT = 4;
Signal.CONNECTION_LIMIT_EXCEEDED_EXCEPTION = 'Connection limit exceeded';
Signal.SIGNAL_WIDTH_SHOULD_MATCH_EXCEPTION = 'Signal width should match';

Signal.prototype.setValue = function (value) {
    var changed, i;

    value = BitUtil.getMask(this.width) & value;
    changed = value !== this.value;
    if (changed) {
        this.value = value;

        for (i = 0; i < this.connectList.length; i++) {
            this.connectList[i].setValue(value);
        }

        if (this.isInput && this.parentModule) {
            console.log('update', this);
            this.parentModule.update();
        }
    }
};

Signal.prototype.getValue = function () {
    return this.value;
};

Signal.prototype.getWidth = function () {
    return this.width;
};

Signal.prototype.toggle = function () {
    this.setValue(BitUtil.getMask(this.width) & ~this.value);
};

Signal.prototype.connect = function (signal) {
    if (this.connected === Signal.CONNECTION_LIMIT) {
        throw Signal.CONNECTION_LIMIT_EXCEEDED_EXCEPTION;
    }
    if (this.width !== signal.getWidth()) {
        throw Signal.SIGNAL_WIDTH_SHOULD_MATCH_EXCEPTION;
    }

    this.connectList.push(signal);
    this.connected++;
};

// ---------------------------------------------------------------------------------------------------------------------

var AbstractModule;

AbstractModule = function (parentModule, simulator) {
    this.parentModule = parentModule;
    this.simulator = simulator;
    this.signalCollection = [];
    this.moduleCollection = [];
};

AbstractModule.prototype.getSignalCollection = function () {
    return this.signalCollection;
};

AbstractModule.prototype.getModuleCollection = function () {
    return this.moduleCollection;
};

AbstractModule.prototype.getUpdate = function () {
    return true;
};

// ---------------------------------------------------------------------------------------------------------------------

var AbstractSimulator;

AbstractSimulator = function () {
    AbstractModule.apply(this, arguments);

    this.updateList = [];
};

AbstractSimulator.prototype = Object.create(AbstractModule.prototype);
AbstractSimulator.prototype.constructor = AbstractSimulator;

// ---------------------------------------------------------------------------------------------------------------------

var Nand;

Nand = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.signalCollection.push(
        this.inA = new Signal(this, simulator, 1, true),
        this.inB = new Signal(this, simulator, 1, true),
        this.out = new Signal(this, simulator, 1, false)
    );
};

Nand.prototype = Object.create(AbstractModule.prototype);
Nand.prototype.constructor = Nand;

Nand.prototype.update = function () {
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

// ---------------------------------------------------------------------------------------------------------------------

var FlipFlopSR;

FlipFlopSR = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.moduleCollection.push(
        this.nand1 = new Nand(this, simulator),
        this.nand2 = new Nand(this, simulator)
    );

    this.nand1.getOut().connect(this.nand2.getInA());
    this.nand2.getOut().connect(this.nand1.getInB());
};

FlipFlopSR.prototype = Object.create(AbstractModule.prototype);
FlipFlopSR.prototype.constructor = FlipFlopSR;

FlipFlopSR.prototype.getNand1 = function () {
    return this.nand1;
};

FlipFlopSR.prototype.getNand2 = function () {
    return this.nand2;
};

FlipFlopSR.prototype.getNotSet = function () {
    return this.nand1.getInA();
};

FlipFlopSR.prototype.getNotReset = function () {
    return this.nand2.getInB();
};

FlipFlopSR.prototype.getQ = function () {
    return this.nand1.getOut();
};

// ---------------------------------------------------------------------------------------------------------------------

var DLatch;

DLatch = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.moduleCollection.push(
        this.flipFlopSR = new FlipFlopSR(this, simulator),
        this.nand1 = new Nand(this, simulator),
        this.nand2 = new Nand(this, simulator)
    );

    this.nand1.getOut().connect(this.flipFlopSR.getNotSet());
    this.nand2.getOut().connect(this.flipFlopSR.getNotReset());

    this.nand1.getOut().connect(this.nand2.getInA());
    this.nand2.getInB().connect(this.nand1.getInB());
};

DLatch.prototype = Object.create(AbstractModule.prototype);
DLatch.prototype.constructor = DLatch;

DLatch.prototype.getFlipFlopSR = function () {
    return this.flipFlopSR;
};

DLatch.prototype.getNand1 = function () {
    return this.nand1;
};

DLatch.prototype.getNand2 = function () {
    return this.nand2;
};

DLatch.prototype.getInput = function () {
    return this.nand1.getInA();
};

DLatch.prototype.getClock = function () {
    return this.nand2.getInB();
};

DLatch.prototype.getQ = function () {
    return this.flipFlopSR.getQ();
};

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

var Simulator;

Simulator = function () {
    AbstractSimulator.apply(this, arguments);

    this.moduleCollection.push(
        this.dLatch = new DLatch(this, this)
    );
    this.signalCollection.push(
        this.s1 = new Signal(this, this, 1, false),
        this.s2 = new Signal(this, this, 1, false)
    );
};

Simulator.prototype = Object.create(AbstractSimulator.prototype);
Simulator.prototype.constructor = Simulator;

Simulator.prototype.run = function () {
    this.dLatch.getInput().setValue(1);
    this.dLatch.getClock().setValue(0);
    console.log(this.dLatch.getQ().getValue());

    this.dLatch.getInput().setValue(0);
    // this.dLatch.getClock().setValue(0);
    console.log(this.dLatch.getQ().getValue());

    this.dLatch.getInput().setValue(1);
    // dLatch.getClock().setValue(0);
    console.log(this.dLatch.getQ().getValue());


    this.dLatch.getInput().setValue(1);
    this.dLatch.getClock().setValue(1);
    console.log(this.dLatch.getQ().getValue());

    this.dLatch.getInput().setValue(1);
    this.dLatch.getClock().setValue(0);
    console.log(this.dLatch.getQ().getValue());

    this.dLatch.getInput().setValue(0);
    this.dLatch.getClock().setValue(0);
    console.log(this.dLatch.getQ().getValue());

    console.log('-----');
    console.log( this.s1.getValue() );
    console.log( this.s2.getValue() );

    this.s1.connect(this.s2);
    this.s1.setValue(1);
    console.log( this.s1.getValue() );
    console.log( this.s2.getValue() );

    this.s1.toggle();
    console.log( this.s1.getValue() );
    console.log( this.s2.getValue() );

    this.s1.toggle();
    console.log( this.s1.getValue() );
    console.log( this.s2.getValue() );

};

// ---------------------------------------------------------------------------------------------------------------------

var simulator = new Simulator();

simulator.run();


console.log(simulator.getModuleCollection());


