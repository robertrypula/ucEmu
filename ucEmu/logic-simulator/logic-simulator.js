'use strict';

/*
    TODO:
    - can connect only when one signal acts as input and seconds acts as output
    - can connect signalA only when signalB belongs to module that is kid of signalA's module
 */

// ---------------------------------------------------------------------------------------------------------------------


function _Util() {
    function shuffle(a) {
        var j, x, i;

        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }

    return {
        shuffle: shuffle
    }
}

var Util = new _Util();

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

var Connection;

Connection = function (signalFrom, signalTo) {
    this.signalFrom = signalFrom;
    this.signalTo = signalTo;
};

Connection.prototype.getSignalFrom = function () {
    return this.signalFrom;
};

Connection.prototype.getSignalTo = function () {
    return this.signalTo;
};

// ---------------------------------------------------------------------------------------------------------------------

var Signal;

Signal = function (parentModule, simulator, width, updateParentModuleAtChange) {
    this.parentModule = parentModule;
    this.simulator = simulator;
    this.width = width;
    this.updateParentModuleAtChange = !!updateParentModuleAtChange;
    this.value = null;
    this.connectionFrom = null;
    this.connectionTo = null;
};

Signal.CONNECTION_ALREADY_EXISTS_EXCEPTION = 'Connection already exists';
Signal.CANNOT_CONNECT_SIGNAL_TO_ITSELF_EXCEPTION = 'Cannot connect signal to itself';
Signal.SIGNAL_WIDTH_SHOULD_MATCH_EXCEPTION = 'Signal width should match';

Signal.prototype.setValue = function (value) {
    var changed, i;

    value = BitUtil.getMask(this.width) & value;
    changed = value !== this.value;

    if (!changed) {
        return;
    }

    this.value = value;
    if (this.connectionTo) {
        this.connectionTo.getSignalTo().setValue(value);
    }

    if (this.updateParentModuleAtChange && this.parentModule) {
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
    var connection;

    if (this.connectionTo || signal.connectionFrom) {
        throw Signal.CONNECTION_ALREADY_EXISTS_EXCEPTION;
    }

    if (this === signal) {
        throw Signal.CANNOT_CONNECT_SIGNAL_TO_ITSELF_EXCEPTION;
    }
    if (this.width !== signal.getWidth()) {
        throw Signal.SIGNAL_WIDTH_SHOULD_MATCH_EXCEPTION;
    }

    connection = new Connection(this, signal);
    this.connectionTo = connection;
    signal.connectionFrom = connection;
};

// ---------------------------------------------------------------------------------------------------------------------

var AbstractModule;

AbstractModule = function (parentModule, simulator) {
    this.parentModule = parentModule;
    this.simulator = simulator;
    this.signalCollection = [];
    this.moduleCollection = [];
    this.propagationDelayInitial = 0;
    this.propagationDelay = 0;
    this.moduleGiveSignal = false;
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

AbstractModule.prototype.fillWithModuleThatGiveSignal = function (list) {
    var i;

    if (this.moduleGiveSignal) {
        list.push(this);
    }

    for (i = 0; i < this.moduleCollection.length; i++) {
        this.moduleCollection[i].fillWithModuleThatGiveSignal(list);
    }
};

AbstractModule.prototype.resetPropagationDelay = function () {
    this.propagationDelay = Math.round(
        this.propagationDelayInitial * (1 + Math.random() * 0.1)
    );
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
    var index = this.propagateLaterList.indexOf(module);

    if (index < 0) {
        this.propagateLaterList.push(module);
    }
};

AbstractSimulator.prototype.allPropagated = function () {
    return this.propagateLaterList.length === 0;
}

AbstractSimulator.prototype.initializate = function () {
    var i, moduleThatGivesSignalList = [];

    this.fillWithModuleThatGiveSignal(moduleThatGivesSignalList);
    Util.shuffle(moduleThatGivesSignalList);

    for (i = 0; i < moduleThatGivesSignalList.length; i++) {
        this.propagateLater(moduleThatGivesSignalList[i]);
    }

    this.propagate(true);
};

AbstractSimulator.prototype.propagate = function (forceCalculateOutputFromInput) {
    var i, initialLength, removeIndexList;

    removeIndexList = [];
    initialLength = this.propagateLaterList.length;    // this line is imporant because array length may change in the loop
    for (i = 0; i < initialLength; i++) {
        if (forceCalculateOutputFromInput) {
            this.propagateLaterList[i].calculateOutputFromInput();
        } else {
            if (this.propagateLaterList[i].update()) {
                removeIndexList.push(i);
            }
        }
    }

    for (i = removeIndexList.length - 1; i >= 0; i--) {
        this.propagateLaterList.splice(removeIndexList[i], 1);
    }
};

// ---------------------------------------------------------------------------------------------------------------------

var High;

High = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.moduleGiveSignal = true;

    this.signalCollection.push(
        this.out = new Signal(this, simulator, 1, false)
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

// ---------------------------------------------------------------------------------------------------------------------

var Low;

Low = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.moduleGiveSignal = true;

    this.signalCollection.push(
        this.out = new Signal(this, simulator, 1, false)
    );
};

Low.prototype = Object.create(AbstractModule.prototype);
Low.prototype.constructor = Low;

Low.prototype.calculateOutputFromInput = function () {
    this.out.setValue(0);
};

Low.prototype.getOut = function () {
    return this.out;
};

// ---------------------------------------------------------------------------------------------------------------------

var Nand;

Nand = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.propagationDelayInitial = 10;
    this.moduleGiveSignal = true;

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
    this.moduleGiveSignal = true;

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

var FanOut1To2;

FanOut1To2 = function (parentModule, simulator) {
    AbstractModule.apply(this, arguments);

    this.signalCollection.push(
        this.in = new Signal(this, simulator, 1, true),
        this.out1 = new Signal(this, simulator, 1, false),
        this.out2 = new Signal(this, simulator, 1, false)
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

// ---------------------------------------------------------------------------------------------------------------------

var FanOut1To3;

FanOut1To3 = function (parentModule, simulator) {
    FanOut1To2.apply(this, arguments);

    this.signalCollection.push(
        this.out3 = new Signal(this, simulator, 1, false)
    );
};

FanOut1To3.prototype = Object.create(FanOut1To2.prototype);
FanOut1To3.prototype.constructor = FanOut1To3;

FanOut1To3.prototype.calculateOutputFromInput = function () {
    FanOut1To2.prototype.calculateOutputFromInput.call(this);         // TODO check it
    this.out3.setValue(this.in.getValue());
};

FanOut1To3.prototype.getOut3 = function () {
    return this.out3;
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
        this.clockFanOut = new FanOut1To2(this, simulator),
        this.nand1 = new Nand(this, simulator),
        this.nand1FanOut = new FanOut1To2(this, simulator),
        this.nand2 = new Nand(this, simulator),
        this.flipFlopSR = new FlipFlopSR(this, simulator)
    );

    this.clockFanOut.getOut1().connect(this.nand1.getInB());
    this.clockFanOut.getOut2().connect(this.nand2.getInB());

    this.nand1.getOut().connect(this.nand1FanOut.getIn());
    this.nand1FanOut.getOut1().connect(this.flipFlopSR.getNotSet());
    this.nand1FanOut.getOut2().connect(this.nand2.getInA());

    this.nand2.getOut().connect(this.flipFlopSR.getNotReset());
};

DLatch.prototype = Object.create(AbstractModule.prototype);
DLatch.prototype.constructor = DLatch;

DLatch.prototype.getClockFanOut = function () {
    return this.clockFanOut;
};

DLatch.prototype.getFlipFlopSR = function () {
    return this.flipFlopSR;
};

DLatch.prototype.getNand1 = function () {
    return this.nand1;
};

DLatch.prototype.getNand1FanOut = function () {
    return this.nand1FanOut;
};

DLatch.prototype.getNand2 = function () {
    return this.nand2;
};

DLatch.prototype.getInput = function () {
    return this.nand1.getInA();
};

DLatch.prototype.getClock = function () {
    return this.clockFanOut.getIn();
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
        this.dLatch = new DLatch(this, this),
        this.low = new High(this, this),
        this.fanOut = new FanOut1To3(this, this)
    );

    this.low.getOut().connect(this.fanOut.getIn());
    this.fanOut.getOut1().connect(this.dLatch.getClock());
    this.fanOut.getOut2().connect(this.dLatch.getInput());

    this.initializate();
};

Simulator.prototype = Object.create(AbstractSimulator.prototype);
Simulator.prototype.constructor = Simulator;

Simulator.prototype.propagationLoop = function () {
    while (!this.allPropagated()) {
        console.log('Value: ' + this.dLatch.getQ().getValue());
        this.propagate();
    }
    console.log('Value: ' + this.dLatch.getQ().getValue());
    console.log('--');
};

Simulator.prototype.run = function () {
    console.log(this);
    console.log('Value: ' + this.dLatch.getQ().getValue());
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

// ---------------------------------------------------------------------------------------------------------------------

var simulator = new Simulator();

simulator.run();

console.log('--------');
console.log(simulator.getModuleCollection());


