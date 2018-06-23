// Copyright (c) 2015-2018 Robert Rypuła - https://github.com/robertrypula/ucEmu
'use strict';

/*
    TODO 2016.09.20
    - can connect only when one signal acts as input and seconds acts as output
    - can connect signalA only when signalB belongs to module that is kid of signalA's module
    - there should be NOT output module like LED, only input module that gives signal with variable width
    - check initialization, it might not delete modules at remove list when force flag is set to true
    - remove fanOut1to3, design should be as simple as possible

    TODO 2018.06.23
    - move this code to TypeScript and take it to separate repository
 */

var simulator = new Simulator();

simulator.run();

console.log('--------');
console.log(simulator.getModuleCollection());
