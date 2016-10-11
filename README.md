# grunt-appc-istanbul

> A lightweight plugin to generate code coverage (leveraging istanbul) for Arrow projects.

## Getting Started
This plugin requires Grunt `~1.0.0` and **assumes you already have Appc CLI installed on your machine**.

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
            proj: '/Users/wilson_san/sandbox/monkeyAli',
            src: [
                '<%= appc_istanbul.samples.proj %>/app.js',
                '<%= appc_istanbul.samples.proj %>/apis/*.js',
                '<%= appc_istanbul.samples.proj %>/blocks/*.js',
            ],
            dest: 'coverage/'
        }
    }
});
```
When you run this plugin, the plugin will do the following:
1. Create a copy of your Arrow project into the `./tmp` folder.
2. Instrument the specified JS files.
3. Run `appc run` in `./tmp`.
4. At this point, a copy of your Arrow project will be running and you can run your unit tests (e.g. mocha, grunt-mocha etc.) that will make CRUD calls to your Arrow project.
5. Once your unit tests are done running, press `ctrl+c` to allow the plugin to create the report.

In the above example, since the `options` property is not specified in the `samples` target, a HTML code coverage report will be generated (by default) into the `dest` directory.

### Target Properties (required)

#### proj
Type: `String`

The value should be the path to your Arrow project.

#### src
Type: `Array`

The string values in the array should be JS files in your Arrow project that you want code coverage on.

#### dest
Type: `String`

The value should be a directory and you do not need to create the `dest` directory beforehand. It will be created if one does not exist.

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
            proj: '/Users/wilson_san/sandbox/monkeyAli',
            src: [
                '<%= appc_istanbul.samples.proj %>/app.js',
                '<%= appc_istanbul.samples.proj %>/apis/*.js',
                '<%= appc_istanbul.samples.proj %>/blocks/*.js',
            ],
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
            proj: '/Users/wilson_san/sandbox/monkeyAli',
            src: [
                '<%= appc_istanbul.samples.proj %>/app.js',
                '<%= appc_istanbul.samples.proj %>/apis/*.js',
                '<%= appc_istanbul.samples.proj %>/blocks/*.js',
            ],
            dest: 'coverage/'
        }
    }
});
```
In the above example, only the LCOV code coverage report will be generated into the `dest` directory.

Also, it is recommended to clean your `dest` and the auto-generated `tmp` directory before generating the code coverage report. This allows for an accurate code coverage report. For example, in your `Gruntfile.js`:
```js
grunt.initConfig({
    // clean the coverage folder before generating code coverage
    clean: {
        output: ['coverage/**', 'tmp/**']
    },

    appc_istanbul: {
        samples: {
            proj: '/Users/wilson_san/sandbox/monkeyAli',
            src: [
                '<%= appc_istanbul.samples.proj %>/app.js',
                '<%= appc_istanbul.samples.proj %>/apis/*.js',
                '<%= appc_istanbul.samples.proj %>/blocks/*.js',
            ],
            dest: 'coverage/'
        }
    }
    ...
});

...

grunt.loadNpmTasks('grunt-contrib-clean');
grunt.registerTask('default', ['clean', 'appc_istanbul']);
```