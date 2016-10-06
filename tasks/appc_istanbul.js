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
    istanbul = require('istanbul'); // http://gotwarlost.github.io/istanbul/public/apidocs/

module.exports = function (grunt) {
    grunt.registerMultiTask('appc_istanbul', 'Generate code coverage using istanbul', function () {
        // TODO: spit out a warning if no srcs, dest or grunt file format is specified
        // TODO: check if dest is only a directory

        const
            that = this,
            done = that.async();

        that.files.forEach(function (file) {
            const
                instrumenter = new istanbul.Instrumenter(),
                collector = new istanbul.Collector();

            file.src.forEach(function (src) {
                const ic = instrumenter.instrumentSync(
                    grunt.file.read(src),
                    src
                );
                // run the instrumented js file in v8 with the same context/scope
                vm.runInThisContext(ic);
                // after the instrumented js file has been run, istanbul stores coverage data in node's global variable
                collector.add(global.__coverage__);
            });

            /*
                options.htmlLcov = generate both the html and lcov report
                options.lcovOnly = generate only the lcov report
                options.html OR no options = generate the html report; the default report
            */
            const
                reports = [],
                options = that.options(),
                // using default istanbul configuration; hence, the false parameter
                reporter = new istanbul.Reporter(false, file.dest);

            let trackWrite = 0;

            if (options && options.htmlLcov) {
                // per istanbul api: http://gotwarlost.github.io/istanbul/public/apidocs/classes/LcovReport.html
                reports.push('lcov');
            }
            else if (options && options.lcovOnly) {
                reports.push('lcovonly');
            }
            else {
                reports.push('html');
            }
            reporter.addAll(reports);
            // writing the reports asynchronously; hence, the false parameter
            reporter.write(collector, false, function () {
                if (++trackWrite === reports.length - 1) {
                    done();
                }
            });
        });
    });
};