// Copyright (c) 2015-2016 Robert Rypuła
'use strict';

if (SimpleCpu.bootConfig.createAlias) {
    // create aliases for easier access

    SimpleCpu = SimpleCpu.Injector.resolve('????????');
}

if (SimpleCpu.isNode) {
    module.exports = SimpleCpu;
}
