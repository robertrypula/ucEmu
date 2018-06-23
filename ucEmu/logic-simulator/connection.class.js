// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

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
