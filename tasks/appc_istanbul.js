// TODO: incorporate grunt-appc-js

'use strict';

const IstanbulWrapper = require('../lib/istanbul_wrapper.js');

module.exports = function (grunt) {
    grunt.registerMultiTask('appc_istanbul', 'Generate code coverage using istanbul', function () {
        const
            that = this,
            done = that.async();

        that.files.forEach(function (file) {
            if (!file.main) {
                grunt.fail.fatal(`'main' property not specified for target ${that.target}.`, 1);
            }
            if (!file.src) {
                grunt.fail.fatal(`'src' property not specified for target ${that.target}.`, 1);
            }
            if (!file.dest) {
                grunt.fail.fatal(`'dest' property not specified for target ${that.target}.`, 1);
            }

            const iw = new IstanbulWrapper();
            // instrument all the js files/code
            file.src.forEach(function (src) {
                const tmpSrc = `${process.cwd()}/tmp/${src}`;
                if (src === file.main) {
                    iw.setMain(tmpSrc);
                }
                // all the instrumentation and coverage data gathering will be done in the tmp folder
                grunt.file.copy(src, tmpSrc);
                iw.instrument(tmpSrc, src);
            });
            iw.runEntryPoint(function () {
                iw.addCoverage();
                iw.makeReport(that.options(), file.dest);
                grunt.log.ok(`Finished writing code coverage report for target '${that.target}'.`);
                done();
            });
        });
    });
};