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

        AppcIstanbul_setupAndRun: {
            sample: {
                proj: '/Users/wilson_san/sandbox/monkeygorillaz',
                src: [
                    '<%= AppcIstanbul_setupAndRun.sample.proj %>/app.js',
                    '<%= AppcIstanbul_setupAndRun.sample.proj %>/apis/*.js',
                    '<%= AppcIstanbul_setupAndRun.sample.proj %>/blocks/*.js',
                ],
                waitForLog: 'server started on port 8080'
            }
        },

        AppcIstanbul_makeReport: {
            sample: {
                dest: 'coverage/'
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', [
        'clean',
        'AppcIstanbul_setupAndRun',
        /* do other stuff like running tests*/
        'AppcIstanbul_makeReport'
    ]);
};