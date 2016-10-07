'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // clean the coverage folder before generating code coverage
        clean: {
            output: ['coverage/*']
        },

        appc_istanbul: {
            samples: {
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