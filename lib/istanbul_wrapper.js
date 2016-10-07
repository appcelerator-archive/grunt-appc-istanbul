'use strict';

const
    vm = require('vm'),
    istanbul = require('istanbul'); // http://gotwarlost.github.io/istanbul/public/apidocs/

class IstanbulWrapper {
    constructor() {
        this.instrumenter = new istanbul.Instrumenter();
        this.collector = new istanbul.Collector();
    }

    /*
        instrument the js code, run the instrumented code, and collect the code covereage data

        @param {String} src - the js code to instrument
        @param {String} filename - the filename associated with the js code
        @return {Object} - returns a istanbul.Collector() object
    */
    instrumentSrc(src, filename) {
        const ic = this.instrumenter.instrumentSync(src, filename);
        // run the instrumented js file in v8 with the same context/scope
        vm.runInThisContext(ic);
        // after the instrumented js file has been run, istanbul stores coverage data in node's global variable
        this.collector.add(global.__coverage__);
    }

    /*
        generate the code coverage report into the specified directory;
        by default, the html code coverage will be generated if no properties are specified in the options property

        @param {Object} options - the grunt's task option property should contain either htmlLcov or lcovOnly
        @param {String} dest - the directory to generate the report into
    */
    makeReport(options, dest) {
        let report = '';

        // using default istanbul configuration; hence, the false argument
        const reporter = new istanbul.Reporter(false, dest);

        if (options && options.htmlLcov) {
            // per istanbul api: http://gotwarlost.github.io/istanbul/public/apidocs/classes/LcovReport.html
            report = 'lcov';
        }
        else if (options && options.lcovOnly) {
            report = 'lcovonly';
        }
        else {
            report = 'html';
        }
        reporter.add(report);
        // writing the reports synchronously; hence, the true argument
        reporter.write(this.collector, true, () => { /* do nothing */ });
    }
}

module.exports = IstanbulWrapper;