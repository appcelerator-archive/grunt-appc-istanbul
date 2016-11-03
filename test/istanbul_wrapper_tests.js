'use strict';

const
    IstanbulWrapper = require('../lib/istanbul_wrapper.js'),
    rimraf = require('rimraf'),
    assert = require('assert'),
    spawn = require('child_process').spawn,
    path = require('path');

let iw = null;
describe('new IstanbulWrapper()', function () {
    before(function () {
        // create an instance of IstanbulWrapper
        iw = new IstanbulWrapper();
    });

    it('instance of IstanbulWrapper should be an object', function () {
        assert.ok(iw, 'instance is "null" or something falsy.');
        assert.strictEqual(typeof iw, 'object', 'instance is not an object.');
    });
});

const DUMMY_DIR = path.join(process.cwd(), 'test', 'dummy');
describe('instrument()', function() {
    before(function (done) {
        // it takes a while to create an arrow project; disable timeout
        this.timeout(0);

        // create a dummy arrow app
        const
            args = [
                'new',
                '-t', 'arrow',
                '--name', 'dummy',
                '--project-dir', `${DUMMY_DIR}`
            ],
            appcNewCmd = spawn('appc', args);
        appcNewCmd.stdout.on('data', function (output) {
            console.log(output.toString());
        });
        appcNewCmd.stderr.on('data', function (output) {
            console.log(output.toString());
        });
        appcNewCmd.on('close', function () {
            done();
        });
    });

    it.skip('should instrument specified files', function (done) {
        iw.instrument()
        done();
    });
});

describe('injectCapture()', function() {
    it.skip('should inject capture code');
});

describe('runArrow()', function() {
    it.skip('should run arrow project');
});

describe('gatherCoverage()', function() {
    it.skip('should generate coverage.json file');
});

describe('makeReport()', function() {
    after(function (done) {
        // it also takes a while to delete an arrow project from platform; extend timeout to 10 seconds
        this.timeout(1000 * 10);

        // delete the dummy app from 360 platform
        const appcRmCmd = spawn('appc', ['cloud', 'remove', 'dummy']);
        appcRmCmd.stdout.on('data', function (output) {
            console.log(output.toString());
        });
        appcRmCmd.stderr.on('data', function (output) {
            console.log(output.toString());
        });
        appcRmCmd.on('close', function () {
            // and delete the dummy app from your local machine
            rimraf(DUMMY_DIR, function () {
                done();
            });
        });
    });

    it.skip('should create an html report by default');
    it.skip('should create an lcov and html report');
    it.skip('should create an lcov only report');
    it.skip('should create an cobertura report');
});