// TODO: incorporate grunt-appc-js

'use strict';

const IstanbulWrapper = require('../lib/istanbul_wrapper.js');

module.exports = function (grunt) {
    grunt.registerMultiTask('appc_istanbul', 'Generate code coverage using istanbul', function () {
        const that = this;
        that.files.forEach(function (file) {
            if (!file.entryPoint) {
                grunt.fail.fatal(`'entryPoint' property not specified for target ${that.target}.`, 1);
            }
            if (!file.src) {
                grunt.fail.fatal(`'src' property not specified for target ${that.target}.`, 1);
            }
            if (!file.dest) {
                grunt.fail.fatal(`'dest' property not specified for target ${that.target}.`, 1);
            }

            const iw = new IstanbulWrapper(file.entryPoint);
            file.src.forEach(function (src) {
                const tmpSrc = `${process.cwd()}/tmp/${src}`;
                grunt.file.copy(src, tmpSrc);
                iw.instrument(tmpSrc, src);
            });
            // iw.makeReport(that.options(), file.dest);
            // grunt.log.ok(`Finished writing code coverage report for target '${that.target}'.`);
        });
    });
};