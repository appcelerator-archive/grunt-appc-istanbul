// TODO: need unit test for this library
// TODO: incorporate grunt-appc-js

'use strict';

const
    fs = require('fs'),
    path = require('path'),
    fork = require('child_process').fork,
    istanbul = require('istanbul'); // http://gotwarlost.github.io/istanbul/public/apidocs/

class IstanbulWrapper {
    constructor() {
        this.instrumenter = new istanbul.Instrumenter();
        this.collector = new istanbul.Collector();
        this.main = '';
        // assume the tmp directory has alrady been created
        this.coverageJson = `${process.cwd()}/tmp/coverage.json`;
    }

    /*
        instrument the js code in the tmp folder.

        @param {String} tmpSrc - the js file in tmp to instrument
        @param {String} realSrc - the path to the actual js code
    */
    instrument(tmpSrc, realSrc) {
        let ic = this.instrumenter.instrumentSync(
            fs.readFileSync(tmpSrc, {encoding: 'utf8'}),
            realSrc // used for generating reports
        );
        /*
            need to capture global.__coverage__ in this.main file.
            this will ensure istanbul will capture all the coverage data once this.main file is forked.
        */
        if (tmpSrc === this.main) {
            ic += '\n';
            ic += `require("fs").writeFileSync("${this.coverageJson}", JSON.stringify(global.__coverage__));`;
        }
        fs.writeFileSync(tmpSrc, ic);
    }

    /*
        set this.main to a file in the tmp directory, which represents the actual entry point file.
        @param{String} tmpFile - the path to the tmp file
    */
    setMain(tmpFile) {
        this.main = tmpFile;
    }

    /*
        fork this.main file;
        any files that this.main file uses will also be counted towards the coverage.

        @param {Function} cb - the callback function to call once the fork is done.
    */
    runEntryPoint(cb) {
        fork(this.main)
        .on('exit', (code, signal) => {
            console.log(`fork code: ${code}`);
            console.log(`fork signal: ${signal}`);
            cb();
        });
    }

    /*
        gets this.coverageJson and adds it to istanbul.Collector
    */
    addCoverage() {
        this.collector.add(require(this.coverageJson));
    }

    /*
        generate the code coverage report into the specified directory.
        by default, the html code coverage will be generated if no properties are specified in the options property.

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