// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

var Signal;

Signal = function (parentModule, simulator, name, width, signalRole, onChangeAction) {
    this.parentModule = parentModule;
    this.simulator = simulator;
    this.name = name;
    this.width = typeof width === 'undefined' ? 1 : width;
    this.signalRole = typeof signalRole === 'undefined' ? SignalRole.NONE : signalRole;
    this.onChangeAction = typeof onChangeAction === 'undefined' ? SignalOnChangeAction.NONE : onChangeAction;
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

    if (this.onChangeAction === SignalOnChangeAction.UPDATE_MODULE && this.parentModule) {
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

    console.log(this.parentModule.parentModule.getName() + '/' + this.name + ' -> ' + signal.parentModule.parentModule.getName() + '/' + signal.name);

    if (this.parentModule.parentModule === signal.parentModule.parentModule) {
        console.log('    OKEJ');
    } else {
        console.log('    ...');
    }

    console.log(this.parentModule.getName() + '/' + this.name + ' -> ' + signal.parentModule.parentModule.getName() + '/' + signal.name);
    if (this.parentModule === signal.parentModule.parentModule) {
        console.log('    OKEJ');
    } else {
        console.log('    ...');
    }

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
