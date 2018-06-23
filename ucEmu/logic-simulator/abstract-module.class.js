// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

var AbstractModule;

AbstractModule = function (parentModule, simulator, name) {
    this.name = name;
    this.parentModule = parentModule;
    this.simulator = simulator;
    this.signalCollection = [];
    this.moduleCollection = [];
    this.propagationDelayInitial = 0;
    this.propagationDelay = 0;
    this.moduleGiveSignal = false;
};

AbstractModule.prototype.getName = function () {
    return this.name;
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
