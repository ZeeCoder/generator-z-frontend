'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
    libs: {},

    initializing: function () {
        this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the ' + chalk.red('Z-Frontend') + ' generator!'
        ));

        var prompts = [
            {
                type: 'input',
                name: 'yo_front_src',
                message: 'The folder\'s path which you want to store your asset source files in.',
                default: 'front_src'
            }, {
                type: 'input',
                name: 'yo_web',
                message: 'The public folder.',
                default: 'web'
            }, {
                type: 'input',
                name: 'yo_js_dest_dir',
                message: 'The directory containing the final js files in the public folder.',
                default: 'js'
            }, {
                type: 'input',
                name: 'yo_css_dest_dir',
                message: 'The directory containing the final css files in the public folder.',
                default: 'css'
            }, {
                type: 'input',
                name: 'yo_images_dest_dir',
                message: 'The directory containing the minified images in the public folder.',
                default: 'images'
            }, {
                type: 'input',
                name: 'yo_gulp_bower_dest_dir',
                message: 'The directory containing the bower assets in the public folder.',
                default: 'bower'
            }, {
                type: 'checkbox',
                name: 'libs',
                message: 'What libraries do you want to include?',
                choices: [{
                    name: 'Clam',
                    value: 'clam',
                    checked: true
                }, {
                    name: 'Foundation',
                    value: 'foundation',
                    checked: true
                }, {
                    name: 'Modernizr',
                    value: 'modernizr',
                    checked: true
                }, {
                    name: 'Q',
                    value: 'q',
                    checked: true
                }]
            }
        ];

        this.prompt(prompts, function (answers) {
            answers.error = {
                // This is needed to keep the '<%= error.message %>' string in the
                // gulpfile
                message: '<%= error.message %>'
            };

            this.answers = answers;

            this.libs.clam = this.answers.libs.indexOf('clam') !== -1;
            this.libs.foundation = this.answers.libs.indexOf('foundation') !== -1;
            this.libs.modernizr = this.answers.libs.indexOf('modernizr') !== -1;
            this.libs.q = this.answers.libs.indexOf('q') !== -1;

            done();
        }.bind(this));
    },

    isLibChecked: function(key) {
        return this.answers.libs.indexOf(key) !== -1;
    },

    writing: {
        packageJSON: function () {
          this.template('package.json', 'package.json');
        },

        bowerJSON: function () {
          this.template('bower.json', 'bower.json');
        }
    },

    writing_old: function () {
        this.directory(
            this.templatePath('front_src'),
            this.destinationPath(this.answers.yo_front_src)
        );
        this.mkdir(this.destinationPath(this.answers.yo_web));
        this.mkdir(this.destinationPath(this.answers.yo_web + '/' + this.answers.yo_images_dest_dir));
        this.fs.copyTpl(
            this.templatePath('gulpfile.js'),
            this.destinationPath('gulpfile.js'),
            this.answers
        );
        this.fs.copyTpl(
            this.templatePath('.bowerrc'),
            this.destinationPath('.bowerrc'),
            this.answers
        );
        this.fs.copy(
            this.templatePath('bower.json'),
            this.destinationPath('bower.json')
        );
        this.fs.copy(
            this.templatePath('bower.json.dist'),
            this.destinationPath('bower.json.dist')
        );
        this.fs.copy(
            this.templatePath('package.json'),
            this.destinationPath('package.json')
        );
        this.fs.copy(
            this.templatePath('package.json.dist'),
            this.destinationPath('package.json.dist')
        );
        this.fs.copy(
            this.templatePath('.editorconfig'),
            this.destinationPath('.editorconfig')
        );
        this.fs.copy(
            this.templatePath('gitattributes'),
            this.destinationPath('gitattributes')
        );
    },

    install: function () {
        this.installDependencies({
            skipInstall: this.options['skip-install'],
            callback: function () {
                if (this.options['skip-install']) {
                    return;
                }

                this.spawnCommand('gulp', ['bower']);
                this.spawnCommand('gulp', ['styles']);
                this.spawnCommand('gulp', ['scripts']);
            }.bind(this)
        });
    }
});
