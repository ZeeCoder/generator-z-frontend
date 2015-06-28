'use strict';

var util = require('./front_src/gulp/util');
util.checkIfEnvIsValid();

var gulp       = require('gulp');
var $          = require('gulp-load-plugins')();
var glob       = require('glob');
var path       = require('path');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var del        = require('del');
var fs         = require('fs');

if (util.isEnv('dev')) {
    // The following modules are not installed on prod servers, since they are
    // not part of the deployment process.
    var sprity   = require('sprity');
    var notifier = require('node-notifier');
}

gulp.task('scripts', function() {
    del.sync(util.dest(util.jsDestDir));

    glob.sync(util.src('scripts/*.js')).forEach(function(scriptPath) {
        browserify({
            entries: scriptPath
            ,debug: util.isEnv('dev') // Triggers sourcemap generation
            // ,paths: [util.src('bower_components')]
        })
        .bundle()
        .on('error', util.handleError)
        .pipe(source(path.basename(scriptPath)))
        .pipe(buffer())
        .pipe($.if(util.isEnv('prod'), $.uglify({ mangle: false })))
        .pipe(gulp.dest(util.dest('js')));
    });
});

gulp.task('styles', function () {
    del.sync(util.dest(util.jsDestDir));

    return gulp.src(util.src('styles/*.scss'))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            includePaths: [util.src('bower_components')],
            // Used by the `image-url` sass function
            imagePath: '../' + util.imagesDestDir
        })
        .on('error', util.handleError))
        .pipe($.if(util.isEnv('dev'), $.sourcemaps.init()))
        .pipe($.autoprefixer({browsers: ['> 1%']}))
        .pipe($.if(util.isEnv('dev'), $.sourcemaps.write()))
        .pipe($.if(util.isEnv('prod'), $.cssmin()))
        .pipe(gulp.dest(util.dest('css')));
});

gulp.task('vendors', function() {
    if (!util.isEnv('dev')) {
        return;
    }

    del.sync(util.dest(util.bowerDestDir));

    // Copy stuff into the bower/ dir
    gulp.src([
        util.src('bower_components/jquery/dist/jquery.min.js'),
        // ,util.src('bower_components/ckeditor/**/*')
    ], {base: util.src('bower_components')})
    .pipe(gulp.dest(util.dest(util.bowerDestDir)));

    // Concatenate files into vendor.js
    gulp.src([
        util.src('bower_components/modernizr/modernizr.js')
        // ,util.src('bower_components/foundation/js/foundation.min.js')
    ])
    .pipe($.uglify())
    .pipe($.rename({ basename: 'vendor', extname: '.js' }))
    .pipe(gulp.dest(util.dest(util.bowerDestDir)));

    // Concatenate files into vendor.css
    gulp.src([
        util.src('bower_components/normalize.css/normalize.css')
        // ,util.src('bower_components/foundation/js/foundation.min.js')
    ])
    .pipe($.cssmin())
    .pipe($.rename({ basename: 'vendor', extname: '.css' }))
    .pipe(gulp.dest(util.dest(util.bowerDestDir)));
});

gulp.task('images', function () {
    if (!util.isEnv('dev')) {
        return;
    }

    return gulp
        .src(util.dest(util.imagesDestDir + '/**/*'))
        .pipe($.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(util.dest(util.imagesDestDir)));
});

gulp.task('watch', function() {
    if (!util.isEnv('dev')) {
        return;
    }

    $.watch(util.src('styles/**/*.scss'), function () {
        gulp.start('styles');
    });

    $.watch(util.src('scripts/**/*.js'), function () {
        gulp.start('scripts');
    });

    $.watch(util.src('sprites/**/*.png'), function () {
        gulp.start('sprites');
    });

    $.watch(util.dest(util.imagesDestDir + '/**/*'), function () {
        notifier.notify({
            'title': 'Reminder',
            'message': 'It seems you added some images. Don\'t forget to run `gulp images` to optimise them!'
        });
    });
});

gulp.task('build', ['scripts', 'styles']);

gulp.task('default', ['build']);
