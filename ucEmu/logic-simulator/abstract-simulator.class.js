// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

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
