'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            output: [
                'coverage/**',
                'tmp/**',
                'child.pid'
            ]
        },

        appc_istanbul: {
            samples: {
                proj: '/Users/wilson_san/sandbox/monkeygorillaz',
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