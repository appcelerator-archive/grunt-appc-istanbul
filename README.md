# grunt-appc-istanbul

> A lightweight plugin to generate code coverage while leveraging istanbul.

## Getting Started
This plugin requires Grunt `~1.0.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-appc-istanbul --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-appc-istanbul');
```

## The "appc_istanbul" task

### Overview
In your project's Gruntfile, add a section named `appc_istanbul` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    appc_istanbul: {
        samples: {
            src: './samples/*.js',
            dest: 'coverage/'
        }
    }
});
```
In the above example, since the `options` property is not specified in the `samples` target, a HTML code coverage report will be generated into the `dest` directory.

By default, if the `options` property is not specified, then a HTML code coverage report will be generated. See [example](http://gotwarlost.github.io/istanbul/public/coverage/lcov-report/index.html).

**Note:**
* The value for `dest` should be a directory.
* You do not need to create the `dest` directory beforehand. The `dest` directory will be created if one does not exist.

### Options

#### options.htmlLcov
Type: `Boolean`
Default value: `false`

If this property is specified, then both the HTML and LCOV code coverage reports are generated in the target's `dest` directory.

#### options.lcovOnly
Type: `Boolean`
Default value: `false`

If this property is specified, then only a LCOV code coverage report is generated in the target's `dest` directory.

### Usage Examples
```js
grunt.initConfig({
    appc_istanbul: {
        samples: {
            options: {
                htmlLcov: true
            },
            src: './samples/*.js',
            dest: 'coverage/'
        }
    }
});
```
In the above example, both the HTML and LCOV code coverage reports will be generated into the `dest` directory.

```js
grunt.initConfig({
    appc_istanbul: {
        samples: {
            options: {
                lcovOnly: true
            },
            src: './samples/*.js',
            dest: 'coverage/'
        }
    }
});
```
In the above example, only the LCOV code coverage report will be generated into the `dest` directory.

Also, it is recommended to clean your `dest` directory before generating the code coverage report. This allows for an accurate code coverage report. For example, in your `Gruntfile.js`:
```js
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
    ...
});

...

grunt.loadNpmTasks('grunt-contrib-clean');
grunt.registerTask('default', ['clean', 'appc_istanbul']);
```