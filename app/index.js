'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
    libs: {},

    initializing: function () {
        this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the ' + chalk.red('frontend') + ' generator!'
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
                name: 'yo_bower_dest_dir',
                message: 'The directory containing the bower assets in the public folder.',
                default: 'bower'
            }
        ];

        this.prompt(prompts, function (answers) {
            this.answers = answers;
            done();
        }.bind(this));
    },

    writing: {
        all: function () {
            this.directory(
                this.templatePath('front_src'),
                this.destinationPath(this.answers.yo_front_src)
            );

            this.mkdir(this.destinationPath(this.answers.yo_web));
            this.mkdir(this.destinationPath(this.answers.yo_web + '/' + this.answers.yo_images_dest_dir));
        },

        templates: function () {
            this.fs.copyTpl(
                this.templatePath('gitignore'),
                this.destinationPath('.gitignore'),
                this.answers
            );
            this.fs.copyTpl(
                this.templatePath('front_src/gulp/util.js'),
                this.destinationPath('front_src/gulp/util.js'),
                this.answers
            );
            this.fs.copyTpl(
                this.templatePath('bowerrc'),
                this.destinationPath('.bowerrc'),
                this.answers
            );
            this.fs.copy(
                this.templatePath('gulpfile.js'),
                this.destinationPath('gulpfile.js')
            );
            this.fs.copy(
                this.templatePath('package.json'),
                this.destinationPath('package.json')
            );
            this.fs.copy(
                this.templatePath('package.json.sample'),
                this.destinationPath('package.json.sample')
            );
            this.fs.copy(
                this.templatePath('bower.json'),
                this.destinationPath('bower.json')
            );
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
            this.fs.copy(
                this.templatePath('gitattributes'),
                this.destinationPath('gitattributes')
            );
        }
    },

    install: function () {
        this.installDependencies({
            skipInstall: this.options['skip-install'],
            callback: function () {
                if (this.options['skip-install']) {
                    return;
                }

                this.spawnCommand('gulp', ['vendors']);
                this.spawnCommand('gulp', ['styles']);
                this.spawnCommand('gulp', ['scripts']);
            }.bind(this)
        });
    }
});
