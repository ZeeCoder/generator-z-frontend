'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
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
      }
    ];

    this.prompt(prompts, function (props) {
      props.error = {
        // This is needed to keep the '<%= error.message %>' string in the
        // gulpfile
        message: '<%= error.message %>'
      };
      this.props = props;

      done();
    }.bind(this));
  },

  writing: function () {
    this.directory(
      this.templatePath('front_src'),
      this.destinationPath(this.props.yo_front_src)
    );
    this.mkdir(this.destinationPath(this.props.yo_web));
    this.mkdir(this.destinationPath(this.props.yo_web + '/' + this.props.yo_images_dest_dir));
    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.bowerrc'),
      this.destinationPath('.bowerrc'),
      this.props
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
