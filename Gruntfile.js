'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // clean the coverage folder before generating code coverage
        clean: {
            output: ['coverage/**', 'tmp/**']
        },

        appc_istanbul: {
            samples: {
                proj: '/Users/wilson_san/sandbox/monkeyAli',
                main: '<%= appc_istanbul.samples.proj %>/app.js',
                src: [
                    '<%= appc_istanbul.samples.proj %>/app.js',
                    '<%= appc_istanbul.samples.proj %>/apis/*.js',
                    '<%= appc_istanbul.samples.proj %>/blocks/*.js',
                ],
                dest: 'coverage/'
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'appc_istanbul']);
};