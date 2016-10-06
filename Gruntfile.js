/*
 * grunt-appc-istanbul
 * https://github.com/appcelerator/grunt-appc-istanbul
 *
 * Copyright (c) 2016 Wilson Luu
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // clean the coverage folder before generating code coverage
        clean: {
            output: ['<%=appc_istanbul.settings.dest%>*']
        },

        appc_istanbul: {
            settings: {
                options: {
                    // htmlLcov: true,
                    // lcovOnly: true
                },
                src: './samples/*.js',
                dest: 'coverage/'
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'appc_istanbul']);
};