// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

function _SignalRole() {
    return {
        NONE: 0,
        MODULE_INPUT: 1,
        MODULE_OUTPUT: 2
    }
}

var SignalRole = new _SignalRole();

function _SignalOnChangeAction() {
    return {
        NONE: 0,
        UPDATE_MODULE: 1
    }
}

var SignalOnChangeAction = new _SignalOnChangeAction();
