'use strict';
var argv = require('yargs').argv;
var path = require('path');

module.exports = {
    env:           argv.env || 'dev',
    availableEnvs: ['dev', 'prod'],

    srcPath:       './<%= yo_front_src %>',
    destPath:      './<%= yo_web %>',
    jsDestDir:     '<%= yo_js_dest_dir %>',
    cssDestDir:    '<%= yo_css_dest_dir %>',
    imagesDestDir: '<%= yo_images_dest_dir %>',
    vendorDestDir:  '<%= yo_vendor_dest_dir %>',

    src: function(path) {
        return this.srcPath + '/' + path;
    },

    dest: function(path) {
        return this.destPath + '/' + path;
    },

    isEnv: function(env) {
        return this.env === env;
    },

    checkIfEnvIsValid: function() {
        if (this.availableEnvs.indexOf(this.env) === -1) {
            throw 'The "' + this.env + '" environment is not supported in this gulpfile.';
        }
    },

    handleError: function(error) {
        require('node-notifier').notify({
            'title': 'Compile Error',
            'message': path.basename(error.fileName) + ':' + error.lineNumber + ' "' + error.message + '"'
        });

        console.log(error);

        this.emit('end'); // Keep gulp from hanging on this task
    }
};
