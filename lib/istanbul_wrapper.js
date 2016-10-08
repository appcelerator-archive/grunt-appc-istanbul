// TODO: need unit test for this library
// TODO: incorporate grunt-appc-js

'use strict';

const
    fs = require('fs'),
    path = require('path'),
    fork = require('child_process').fork,
    istanbul = require('istanbul'); // http://gotwarlost.github.io/istanbul/public/apidocs/

class IstanbulWrapper {
    constructor(entryPoint) {
        this.instrumenter = new istanbul.Instrumenter();
        this.collector = new istanbul.Collector();
        this.entryPoint = entryPoint;
    }

    /*
        instrument the js code in the tmp folder

        @param {String} tmpSrc - the js file in tmp to instrument
        @param {String} realSrc - the path to the actual js code
    */
    instrument(tmpSrc, realSrc) {
        let ic = this.instrumenter.instrumentSync(
            fs.readFileSync(tmpSrc, {encoding: 'utf8'}),
            realSrc // used for generating reports
        );
        /*
            need to capture global.__coverage__ in the entryPoint file.
            this will ensure istanbul will capture all the coverage data once the entryPoint file is forked.
        */
        if (this.entryPoint === realSrc) {
            ic += '\n';
            ic += 'require("fs").writeFileSync("./tmp/coverage.json", JSON.stringify(global.__coverage__));';
        }
        fs.writeFileSync(tmpSrc, ic);
    }

    /**/
    runEntryPoint() {
        fork(this.entryPoint)
        .on('exit', (code, signal) => {
            console.log(`code: ${code}`);
            console.log(`signal: ${signal}`);
        });
    }

    /*
    */
    addCoverage(obj) {
        // this.collector.add(global.__coverage__);
        this.collector.add(obj);
    }

    /*
        generate the code coverage report into the specified directory;
        by default, the html code coverage will be generated if no properties are specified in the options property

        @param {Object} options - the grunt's task option property should contain either htmlLcov or lcovOnly
        @param {String} dest - the directory to generate the report into
    */
    makeReport(options, dest) {
        // using default istanbul configuration; hence, the false argument
        const reporter = new istanbul.Reporter(false, dest);

        let report = '';
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