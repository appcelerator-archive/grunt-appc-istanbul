// TODO: incorporate grunt-appc-js

'use strict';

const
    fs = require('fs'),
    path = require('path'),
    kill = require('tree-kill'),
    IstanbulWrapper = require('../lib/istanbul_wrapper.js'),
    iw = new IstanbulWrapper();

const
    PREFIX = 'AppcIstanbul_',
    TMP_DIR = `${process.cwd()}/tmp`;

module.exports = function (grunt) {
    grunt.registerMultiTask(`${PREFIX}setupAndRun`, 'Copy, instrument, and run the Arrow project.', function () {
        const
            that = this,
            done = that.async();

        grunt.log.ok(`Running target '${that.target}'.`);

        if (!that.data.proj) {
            grunt.fail.fatal(`'proj' property not specified.`, 1);
        }
        if (!that.data.src) {
            grunt.fail.fatal(`'src' property not specified.`, 1);
        }
        if (!that.data.waitForLog) {
            grunt.fail.fatal(`'waitForLog' property not specified.`, 1);
        }

        that.files.forEach(function (file) {
            // making a copy of file.proj into tmp directory; all instrumentation and code coverage will occur in the tmp directory
            grunt.log.ok(`Copying ${file.proj} to ./tmp.`);
            grunt.file.copy(file.proj, TMP_DIR);

            // instrument target files specified by the user
            file.src.forEach(function (src) {
                const tmpSrc = src.replace(file.proj, TMP_DIR);
                grunt.log.ok(`Instrumenting ${tmpSrc}.`);
                iw.instrument(tmpSrc, src);
            });

            grunt.log.ok(`Injecting capture code into 'app.js'.`);
            iw.injectCapture();

            grunt.log.ok('Running Arrow project...');
            iw.runArrow(that.data.waitForLog, function () {
                grunt.log.ok(`Found log '${that.data.waitForLog}'. Moving on to next task.`);
                done();
            });
        });
    });

    grunt.registerMultiTask(`${PREFIX}makeReport`, 'Create code coverage report and write into "dest".', function () {
        const
            that = this,
            done = that.async();

        // going to need to run setupAndRun task first, since that's where the instrumentation happens
        that.requires(`${PREFIX}setupAndRun`);

        grunt.log.ok(`Running target '${that.target}'.`);

        if (!that.data.dest) {
            grunt.fail.fatal(`'dest' property not specified.`, 1);
        }

        that.files.forEach(function (file) {
            const somePid = fs.readFileSync(path.join(process.cwd(), 'child.pid'), {encoding: 'utf8'});
            // need to trigger SIGINT in order to gather code coverage data
            kill(somePid, 'SIGINT', function (err) {
                if (err) {
                    grunt.fail.fatal(`'dest' property not specified.`, 1);
                }
                grunt.log.ok(`Gathering code coverage data.`);
                iw.gatherCoverage();

                grunt.log.ok(`Creating report.`);
                iw.makeReport(that.options(), file.dest);

                grunt.log.ok(`Finished writing code coverage report for target '${that.target}'.`);
                done();
            });
        });
    });
};