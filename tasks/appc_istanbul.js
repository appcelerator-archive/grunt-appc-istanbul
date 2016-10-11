// TODO: incorporate grunt-appc-js

'use strict';

const IstanbulWrapper = require('../lib/istanbul_wrapper.js');

module.exports = function (grunt) {
    grunt.registerMultiTask('appc_istanbul', 'Generate code coverage using istanbul', function () {
        const
            that = this,
            done = that.async();

        that.files.forEach(function (file) {
            if (!file.proj) {
                grunt.fail.fatal(`'proj' property not specified for target ${that.target}.`, 1);
            }
            if (!file.src) {
                grunt.fail.fatal(`'src' property not specified for target ${that.target}.`, 1);
            }
            if (!file.dest) {
                grunt.fail.fatal(`'dest' property not specified for target ${that.target}.`, 1);
            }

            // making a copy of file.proj into tmp directory; all instrumentation and code coverage will occur in the tmp directory
            grunt.log.ok(`Copying ${file.proj} to ./tmp for target '${that.target}'.`);
            const tmpDir = `${process.cwd()}/tmp`;
            grunt.file.copy(file.proj, tmpDir);

            const iw = new IstanbulWrapper();
            file.src.forEach(function (src) {
                const tmpSrc = src.replace(file.proj, tmpDir);
                grunt.log.ok(`Instrumenting ${tmpSrc} for target '${that.target}'.`);
                iw.instrument(tmpSrc, src);
            });
            grunt.log.ok(`Running Arrow project for target '${that.target}'.`);
            iw.runArrow(function () {
                grunt.log.ok(`Gathering code coverage data for target '${that.target}'.`);
                iw.addCoverage();
                grunt.log.ok(`Creating report for target '${that.target}'.`);
                iw.makeReport(that.options(), file.dest);
                grunt.log.ok(`Finished writing code coverage report for target '${that.target}'.`);
                done();
            });
        });
    });
};