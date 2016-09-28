// Copyright (c) 2015-2016 Robert Rypuła
'use strict';

var
    SimpleCpu = {},                                        // namespace visible to the global JavaScript scope
    SimpleCpuBootConfig = SimpleCpuBootConfig || {};       // injects boot config

SimpleCpu.version = '1.0.0rc1';

// conditions from: http://stackoverflow.com/a/33697246
SimpleCpu.isNode = typeof module !== 'undefined' && module.exports ? true : false;
SimpleCpu.isWebWorker = !SimpleCpu.isNode && typeof WorkerGlobalScope !== 'undefined' && typeof importScripts == 'function' && navigator instanceof WorkerNavigator;
SimpleCpu.isBrowser = !SimpleCpu.isNode && !SimpleCpu.isWebWorker && typeof navigator !== 'undefined' && typeof document !== 'undefined';

/*
 console.log(SimpleCpu.isNode);
 console.log(SimpleCpu.isWebWorker);
 console.log(SimpleCpu.isBrowser);
 */

SimpleCpu.bootConfig = {
    devScriptBaseUrl: typeof SimpleCpuBootConfig.devScriptBaseUrl === 'string'
        ? SimpleCpuBootConfig.devScriptBaseUrl
        : (SimpleCpu.isBrowser ? window.location.origin + '/src/' : ''),
    prodScriptBaseUrl: typeof SimpleCpuBootConfig.prodScriptBaseUrl === 'string'
        ? SimpleCpuBootConfig.prodScriptBaseUrl
        : (SimpleCpu.isBrowser ? window.location.origin + '/build/' : ''),
    prodScriptName: typeof SimpleCpuBootConfig.prodScriptName === 'string'
        ? SimpleCpuBootConfig.prodScriptName
        : 'simple-cpu-v' + SimpleCpu.version + '.min.js',
    devScriptLoad: typeof SimpleCpuBootConfig.devScriptLoad !== 'undefined'
        ? !!SimpleCpuBootConfig.devScriptLoad
        : false,
    createAlias: typeof SimpleCpuBootConfig.createAlias !== 'undefined'
        ? !!SimpleCpuBootConfig.createAlias
        : (SimpleCpu.isBrowser ? true : false)
};

SimpleCpu.Injector = (function () {
    var Injector;

    Injector = function () {
        this.$$injectRepository = {};
    };

    Injector.RESOLVE_RECURSION_LIMIT = 20;
    Injector.RESOLVE_RECURSION_LIMIT_EXCEED_EXCEPTION = 'Injector - resolve recursion limit exceed';
    Injector.MULTIPLE_REGISTER_EXCEPTION = 'Injector - multiple register calls for the same name';
    Injector.UNABLE_TO_FIND_ITEM_EXCEPTION = 'Injector - unable to find factory/service for given name: ';
    Injector.TYPE = {
        SERVICE: 'SERVICE',
        FACTORY: 'FACTORY'
    };

    Injector.$$resolveRecursionCounter = 0;

    Injector.prototype.$$register = function (name, item, type) {
        if (typeof this.$$injectRepository[name] === 'undefined') {
            this.$$injectRepository[name] = {
                type: type,
                item: item,
                resolveCache: null
            };
        } else {
            throw Injector.MULTIPLE_REGISTER_EXCEPTION;
        }
    };

    Injector.prototype.registerService = function (name, service) {
        this.$$register(name, service, Injector.TYPE.SERVICE);
    };

    Injector.prototype.registerFactory = function (name, factory) {
        this.$$register(name, factory, Injector.TYPE.FACTORY);
    };

    Injector.prototype.resolve = function (name) {
        var i, findResult, injectList = [];

        findResult = this.$$find(name);
        if (findResult.resolveCache) {
            return findResult.resolveCache;
        }

        this.$$resolveRecursionInc();
        for (i = 0; i < findResult.item.$inject.length; i++) {
            injectList.push(
                this.resolve(findResult.item.$inject[i])
            );
        }
        switch (findResult.type) {
            case Injector.TYPE.SERVICE:
                findResult.resolveCache = this.$$injectDependenciesAndInstantiate(findResult, injectList);
                break;
            case Injector.TYPE.FACTORY:
                findResult.resolveCache = this.$$injectDependencies(findResult, injectList);
                break;
        }
        this.$$resolveRecursionDec();

        return findResult.resolveCache;
    };

    Injector.prototype.$$resolveRecursionInc = function () {
        Injector.$$resolveRecursionCounter++;
        if (Injector.$$resolveRecursionCounter >= Injector.RESOLVE_RECURSION_LIMIT) {
            throw Injector.RESOLVE_RECURSION_LIMIT_EXCEED_EXCEPTION;
        }
    };

    Injector.prototype.$$resolveRecursionDec = function () {
        Injector.$$resolveRecursionCounter--;
    };

    Injector.prototype.$$injectDependenciesAndInstantiate = function (findResult, injectList) {
        var
            f = findResult,
            i = injectList,
            r;

        switch (injectList.length) {
            case 0: r = new f.item(); break;
            case 1: r = new f.item(i[0]); break;
            case 2: r = new f.item(i[0], i[1]); break;
            case 3: r = new f.item(i[0], i[1], i[2]); break;
            case 4: r = new f.item(i[0], i[1], i[2], i[3]); break;
            case 5: r = new f.item(i[0], i[1], i[2], i[3], i[4]); break;
            case 6: r = new f.item(i[0], i[1], i[2], i[3], i[4], i[5]); break;
            case 7: r = new f.item(i[0], i[1], i[2], i[3], i[4], i[5], i[6]); break;
            case 8: r = new f.item(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7]); break;
            case 9: r = new f.item(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8]); break;
            case 10: r = new f.item(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8], i[9]); break;
            case 11: r = new f.item(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8], i[9], i[10]); break;
            case 12: r = new f.item(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8], i[9], i[10], i[11]); break;
        }

        return r;
    };

    Injector.prototype.$$injectDependencies = function (findResult, injectList) {
        var
            f = findResult,
            i = injectList,
            r;

        switch (injectList.length) {
            case 0: r = f.item(); break;
            case 1: r = f.item(i[0]); break;
            case 2: r = f.item(i[0], i[1]); break;
            case 3: r = f.item(i[0], i[1], i[2]); break;
            case 4: r = f.item(i[0], i[1], i[2], i[3]); break;
            case 5: r = f.item(i[0], i[1], i[2], i[3], i[4]); break;
            case 6: r = f.item(i[0], i[1], i[2], i[3], i[4], i[5]); break;
            case 7: r = f.item(i[0], i[1], i[2], i[3], i[4], i[5], i[6]); break;
            case 8: r = f.item(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7]); break;
            case 9: r = f.item(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8]); break;
            case 10: r = f.item(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8], i[9]); break;
            case 11: r = f.item(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8], i[9], i[10]); break;
            case 12: r = f.item(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8], i[9], i[10], i[11]); break;
        }

        return r;
    };

    Injector.prototype.$$find = function (name) {
        var key;

        for (key in this.$$injectRepository) {
            if (this.$$injectRepository.hasOwnProperty(key) && key === name) {
                return this.$$injectRepository[key];
            }
        }
        throw Injector.UNABLE_TO_FIND_ITEM_EXCEPTION + name;
    };

    return new Injector(); // instantiate service
})();

SimpleCpu.DynamicScriptLoader = (function () {
    var DynamicScriptLoader;

    DynamicScriptLoader = function () {
    };

    DynamicScriptLoader.prototype.loadList = function (urlList, startingIndex) {
        var i;

        if (typeof startingIndex === 'undefined') {
            startingIndex = 0;
        }

        for (i = startingIndex; i < urlList.length; i++) {
            this.loadOne(urlList[i]);
        }
    };

    DynamicScriptLoader.prototype.loadOne = function (url) {
        document.write('<script src="' + SimpleCpu.bootConfig.devScriptBaseUrl + url + '"></script>')
    };

    return new DynamicScriptLoader(); // instantiate service
})();

SimpleCpu.devScriptList = [
    'simple-cpu-boot.js',
    // TODO add files names
    'simple-cpu-end.js'
];

if (SimpleCpu.isBrowser && SimpleCpu.bootConfig.devScriptLoad) {
    // start from index 1 because simple-cpu-boot.js was already loaded
    SimpleCpu.DynamicScriptLoader.loadList(SimpleCpu.devScriptList, 1);
}
