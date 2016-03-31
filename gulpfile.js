'use strict';

var gulp = require('gulp'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    templateCache = require('gulp-angular-templatecache'),
    cssmin = require('gulp-cssmin'),
    Server = require('karma').Server;

var PROJ_ROOT = '',
    BOWER_COMP_ROOT = PROJ_ROOT + 'bower_components/',
    LESS_ROOT = PROJ_ROOT + 'less/',
    SCRIPTS_ROOT = PROJ_ROOT + 'src/',
    TESTS_ROOT = PROJ_ROOT + 'tests/spec/',
    TEMPLATES_ROOT = PROJ_ROOT + 'views/',
    DIST_ROOT = PROJ_ROOT + 'dist/';

var styles = [LESS_ROOT + '**/*.less'],
    scripts = [
        SCRIPTS_ROOT + 'services/*.js',
        SCRIPTS_ROOT + 'models/**/*.js',
        SCRIPTS_ROOT + 'directives/*.js',
        SCRIPTS_ROOT + 'controllers/flockCtrl.js',
        SCRIPTS_ROOT + 'controllers/lifeCtrl.js',
        SCRIPTS_ROOT + 'controllers/astarCtrl.js',
        SCRIPTS_ROOT + 'controllers/antCtrl.js',
        SCRIPTS_ROOT + 'controllers/chipCtrl.js',
        //SCRIPTS_ROOT + '/controllers/*.js',
        SCRIPTS_ROOT + '*.js'
    ],
    css = [
        DIST_ROOT + 'css/expanded/core.css',
        BOWER_COMP_ROOT + 'angular-bootstrap/ui-bootstrap-csp.css'
    ],
    libs = [
        BOWER_COMP_ROOT + 'jquery/dist/jquery.js',
        BOWER_COMP_ROOT + 'angular/angular.js',
        BOWER_COMP_ROOT + 'angular-ui-router/release/angular-ui-router.js',
        BOWER_COMP_ROOT + 'angular-bootstrap/ui-bootstrap.js',
        BOWER_COMP_ROOT + 'lodash/lodash.js'
        //BOWER_COMP_ROOT + '/threejs/build/three.js'
    ],
    templates = [
        TEMPLATES_ROOT + '**/*.html'
    ],
    tests = [TESTS_ROOT + '*.js'];

/**
 * Run test once and exit
 */
gulp.task('test', ['appscripts'], function (done) {
    Server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function(exitCode) {
        done();
        if (exitCode !== 0) {
            console.log('Karma has exited with ' + exitCode);
        }
    });
});

gulp.task('styles', function () {
    return gulp.src(styles)
        .pipe(less({style: 'expanded'}))
        .pipe(gulp.dest(DIST_ROOT + '/css/expanded'));
});

gulp.task('cssmin', ['styles'], function () {
    gulp.src(css)
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(concat('aidemo.min.css'))
        .pipe(gulp.dest(DIST_ROOT + '/css'));
});

// Lint Task
gulp.task('lint', function () {
    return gulp.src(scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS - LIBRARIES
gulp.task('libs', function () {
    return gulp.src(libs)
        .pipe(concat('libs-all.js'))
        .pipe(gulp.dest(DIST_ROOT))
        .pipe(rename('libs-all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(DIST_ROOT));
});

// Concatenate & Minify JS -- APP
gulp.task('appscripts', ['lint'], function () {
    return gulp.src(scripts)
        .pipe(concat('aidemo.js'))
        .pipe(gulp.dest(DIST_ROOT));
    //.pipe(rename('aidemo.min.js'))
    //.pipe(uglify())
    //.pipe(gulp.dest(DIST_ROOT));
});

gulp.task('templates', function () {
    return gulp.src(templates)
        .pipe(templateCache('aidemo-templates.js', {module: 'aidemo.templates', standalone: true}))
        .pipe(gulp.dest(DIST_ROOT + '/templates'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch(scripts, ['appscripts', 'test']);
    gulp.watch(styles, ['styles', 'cssmin']);
    gulp.watch(templates, ['templates']);
    gulp.watch(tests, ['test']);
});

// Default Task
gulp.task('default', ['templates', 'appscripts', 'styles', 'cssmin', 'test']);

gulp.task('build-all', ['templates', 'libs', 'appscripts', 'styles', 'cssmin', 'test']);
