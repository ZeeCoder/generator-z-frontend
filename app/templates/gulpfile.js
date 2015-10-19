'use strict';

var util = require('./<%= yo_front_src %>/gulp/util');
util.checkIfEnvIsValid();

var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var del  = require('del');

gulp.task('scripts', function() {
    var browserify = require('browserify');
    var source     = require('vinyl-source-stream');
    var buffer     = require('vinyl-buffer');
    var glob       = require('glob');
    var path       = require('path');
    var Q          = require('q');

    del.sync(util.dest(util.jsDestDir));

    var promises = [];
    glob.sync(util.src('scripts/*.js')).forEach(function(scriptPath) {
        var deferred = Q.defer();
        promises.push(deferred.promise);

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
        .pipe(gulp.dest(util.dest('js')))
        .on('finish', function() { deferred.resolve() });
    });

    return Q.all(promises);
});

gulp.task('styles', function () {
    del.sync(util.dest(util.cssDestDir));

    return gulp.src(util.src('styles/*.scss'))
        .pipe($.if(util.isEnv('dev'), $.sourcemaps.init()))
        .pipe($.sass({
            includePaths: [util.src('bower_components')],
        })
        .on('error', util.handleError))
        .pipe($.autoprefixer({browsers: ['> 1%']}))
        .pipe($.if(util.isEnv('dev'), $.sourcemaps.write()))
        .pipe($.if(util.isEnv('prod'), $.cssmin()))
        .pipe(gulp.dest(util.dest('css')));
});

gulp.task('vendors', function() {
    if (!util.isEnv('dev')) {
        return;
    }

    var Q = require('q');

    // Promises are used here, so that the task finished console log would be
    // accurate.
    var promises = [];

    del.sync(util.dest(util.vendorDestDir));

    (function () {
        // Copy stuff into the vendor dir
        var deferred = Q.defer();
        promises.push(deferred.promise);

        console.log('Copying files to the "' + util.dest(util.vendorDestDir) + '" dir...');
        gulp
            .src([
                util.src('bower_components/jquery/dist/jquery.min.js'),
                // ,util.src('bower_components/ckeditor/**/*')
            ], {base: util.src('bower_components')})
            .pipe(gulp.dest(util.dest(util.vendorDestDir)))
            .on('finish', function() { deferred.resolve() });
    })();

    (function () {
        // Concatenate files into vendor.js
        var deferred = Q.defer();
        promises.push(deferred.promise);

        console.log('Creating "vendor.js"...');
        gulp
            .src([
                util.src('bower_components/modernizr/modernizr.js')
                // ,util.src('bower_components/foundation/js/foundation.min.js')
            ])
            .pipe($.concat('vendor.js'))
            // Careful with this, sometimes it mangle's too aggressively. In
            // those cases, try `$.uglify({ mangle: false })` or change the
            // library entirely if you want
            .pipe($.uglify())
            .pipe(gulp.dest(util.dest(util.vendorDestDir)))
            .on('finish', function() { deferred.resolve() });
    })();

    (function () {
        // Concatenate files into vendor.css
        var deferred = Q.defer();
        promises.push(deferred.promise);

        console.log('Creating "vendor.css"...');
        gulp
            .src([
                util.src('bower_components/normalize.css/normalize.css')
                // ,util.src('bower_components/foundation/js/foundation.min.js')
            ])
            .pipe($.cssmin())
            .pipe($.concat('vendor.css'))
            .pipe(gulp.dest(util.dest(util.vendorDestDir)))
            .on('finish', function() { deferred.resolve() });
    })();

    return Q.all(promises);
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

    var notifier = require('node-notifier');

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
