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
        console.log(this.filesSrc);
        console.log(this.options().report);
    });
};