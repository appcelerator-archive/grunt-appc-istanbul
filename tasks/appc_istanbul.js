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
    TMP_DIR = path.join(process.cwd(), 'tmp'),
    TMP_DIR_EXP = new RegExp(`^${TMP_DIR}`),
    NODE_MODULES_EXP = new RegExp(`^${path.join(process.cwd(), 'node_modules')}`);

module.exports = function (grunt) {
    grunt.registerMultiTask(`${PREFIX}setupAndRun`, 'Copy, instrument, and run the Arrow project.', function () {
        const
            that = this,
            done = that.async();

        grunt.log.ok(`Running target '${that.target}'.`);

        if (!that.data.src) {
            grunt.fail.fatal(`'src' property not specified.`, 1);
        }
        if (!that.data.waitForLog) {
            grunt.fail.fatal(`'waitForLog' property not specified.`, 1);
        }

        that.files.forEach(function (file) {
            // making a copy of process.cwd into tmp directory; all instrumentation and code coverage will occur in the tmp directory
            grunt.log.ok(`Copying ${process.cwd()} to ./tmp.`);
            // grunt.file.copy is not smart, need to systematically identify all the files and directories in the arrow project
            grunt.file.expand(`${process.cwd()}/**`)
            .forEach(function (somePath) {
                // preliminary checks before copying files to TMP_DIR
                // grunt.file.copy will recursively copy the tmp directory into itself e.g. <process.cwd()>/tmp/tmp/tmp ...
                const pathIsGood =
                    somePath !== process.cwd() && // shouldn't match the arrow project itself
                    !TMP_DIR_EXP.test(somePath) && // shouldn't match the tmp directory
                    !NODE_MODULES_EXP.test(somePath) // shouldn't match the node_modules directory

                if (pathIsGood) {
                    const
                        suffix = somePath.slice(process.cwd().length + 1), // grab everything after process.cwd path
                        newPathInTmp = path.join(TMP_DIR, suffix);

                    if (grunt.file.isDir(somePath)) {
                        grunt.file.mkdir(newPathInTmp);
                    }
                    else if (grunt.file.isFile(somePath)) {
                        // grunt doc is misleading; need to specify both the src and dest FILE path
                        grunt.file.copy(somePath, newPathInTmp);
                    }
                }
            });

            // instrument target files specified by the user
            file.src.forEach(function (srcSuffix) {
                const
                    tmpSrc = path.join(TMP_DIR, srcSuffix),
                    realSrc = path.join(process.cwd(), srcSuffix);
                grunt.log.ok(`Instrumenting ${tmpSrc}.`);
                iw.instrument(tmpSrc, realSrc);
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