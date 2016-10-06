/*
 * grunt-appc-istanbul
 * https://github.com/appcelerator/grunt-appc-istanbul
 *
 * Copyright (c) 2016 Wilson Luu
 * Licensed under the MIT license.
 */

'use strict';

const
    vm = require('vm'),
    istanbul = require('istanbul'),
    instrumenter = new istanbul.Instrumenter(),
    collector = new istanbul.Collector();

module.exports = function (grunt) {
    grunt.registerMultiTask('appc_istanbul', 'Generate code coverage using istanbul', function () {
        /*
            const ic = instrumenter.instrumentSync(
                fs.readFileSync(path.join(process.cwd(), 'example.js'), {encoding: 'utf8'}),
                path.join(process.cwd(), 'example.js')
            );

            vm.runInThisContext(ic);

            collector.add(global.__coverage__);

            htmlReport.writeReport(collector, false);
        */

        // TODO: need to handle absolute paths and globbing
        console.log(this.filesSrc);

        // TODO: html, lcov, or html AND lcov; default to html
        console.log(this.options().report);
    });
};