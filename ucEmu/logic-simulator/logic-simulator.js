/*
    - add spliter and merger
    - disable fan-out (only one connection per signal) + fix existing modules
    - add two ways relation at connect method
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

Signal = function (parentModule, simulator, width, parentModuleInput) {
    this.parentModule = parentModule;
    this.simulator = simulator;
    this.width = width;
    this.parentModuleInput = parentModuleInput;
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

    if (!changed) {
        return;
    }

    this.value = value;

    for (i = 0; i < this.connectList.length; i++) {
        this.connectList[i].setValue(value);
    }

    if (this.parentModuleInput && this.parentModule) {
        this.parentModule.resetPropagationDelay();
        if (!this.parentModule.update()) {
            if (simulator) {
                simulator.propagateLater(this.parentModule);
            }
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
    this.propagationDelayInitial = 0;
    this.propagationDelay = null;
};

AbstractModule.prototype.getSignalCollection = function () {
    return this.signalCollection;
};

AbstractModule.prototype.getModuleCollection = function () {
    return this.moduleCollection;
};

AbstractModule.prototype.update = function () {
    if (this.propagationDelay > 0) {
        this.propagationDelay--;
        return false;
    }

    this.calculateOutputFromInput();

    return true;
};

AbstractModule.prototype.calculateOutputFromInput = function () {
    // implement it in derived class
};

AbstractModule.prototype.resetPropagationDelay = function () {
    this.propagationDelay = this.propagationDelayInitial;
};

// ---------------------------------------------------------------------------------------------------------------------

var AbstractSimulator;

AbstractSimulator = function () {
    AbstractModule.apply(this, arguments);

    this.propagateLaterList = [];
};

AbstractSimulator.prototype = Object.create(AbstractModule.prototype);
AbstractSimulator.prototype.constructor = AbstractSimulator;

AbstractSimulator.prototype.propagateLater = function (module) {
    this.propagateLaterList.push(module);
};

AbstractSimulator.prototype.allPropagated = function () {
    return this.propagateLaterList.length === 0;
}

AbstractSimulator.prototype.propagate = function () {
    var i, initialLength, removeIndexList;

    removeIndexList = [];
    initialLength = this.propagateLaterList.length;    // this line is imporant because array length may change in the loop
    for (i = 0; i < initialLength; i++) {
        if (this.propagateLaterList[i].update()) {
            removeIndexList.push(i);
        }
    }

    for (i = removeIndexList - 1; i >= 0; i--) {
        this.propagateLaterList.splice(removeIndexList[i], 1);
    }
};

// ---------------------------------------------------------------------------------------------------------------------

var Nand;

Nand = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.propagationDelayInitial = 10;

    this.signalCollection.push(
        this.inA = new Signal(this, simulator, 1, true),
        this.inB = new Signal(this, simulator, 1, true),
        this.out = new Signal(this, simulator, 1, false)
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

// ---------------------------------------------------------------------------------------------------------------------

var Not;

Not = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.propagationDelayInitial = 10;

    this.signalCollection.push(
        this.in = new Signal(this, simulator, 1, true),
        this.out = new Signal(this, simulator, 1, false)
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
        // this.dLatch = new DLatch(this, this)
        this.not1 = new Not(this, this),
        this.not2 = new Not(this, this),
        this.not3 = new Not(this, this),
        this.not4 = new Not(this, this)
    );
    this.signalCollection.push(
        // this.s1 = new Signal(this, this, 1, false),
        // this.s2 = new Signal(this, this, 1, false)
    );

    this.not1.getOut().connect(this.not2.getIn());
    this.not2.getOut().connect(this.not3.getIn());
    this.not3.getOut().connect(this.not4.getIn());
    this.not4.getOut().connect(this.not1.getIn());
};

Simulator.prototype = Object.create(AbstractSimulator.prototype);
Simulator.prototype.constructor = Simulator;

Simulator.prototype.run = function () {
    var limit = 100;

    // this.dLatch.getInput().setValue(1);
    // this.dLatch.getClock().setValue(1);

    this.not1.getIn().setValue(0);

    while (!this.allPropagated() && limit >= 0) {
        console.log(
            'Value: ' +
            // this.dLatch.getQ().getValue()
            this.not4.getOut().getValue()
        );
        this.propagate();

        limit--;
    }

    console.log(
        'Value: ' +
        // this.dLatch.getQ().getValue()
        this.not4.getOut().getValue()
    );

};

// ---------------------------------------------------------------------------------------------------------------------

var simulator = new Simulator();

simulator.run();

console.log('--------');
console.log(simulator.getModuleCollection());


