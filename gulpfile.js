var gulp = require('gulp'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-cssmin');

var PROJ_ROOT = '',
    BOWER_COMP_ROOT = PROJ_ROOT + 'bower_components',
    LESS_ROOT = PROJ_ROOT + 'less',
    SCRIPTS_ROOT = PROJ_ROOT + 'src',
    TESTS_ROOT = PROJ_ROOT + 'tests/spec',
    DIST_ROOT = PROJ_ROOT + 'dist';

var styles = [LESS_ROOT + '/*.less'],
    scripts = [
        SCRIPTS_ROOT + '/utils/*.js',
        SCRIPTS_ROOT + '/models/*.js',
        SCRIPTS_ROOT + '/*.js',
        SCRIPTS_ROOT + '/controller/*.js'
    ],
    css = [DIST_ROOT + '/css/expanded/*.css'],
    libs = [
        '/angular/angular.js',
        BOWER_COMP_ROOT + '/angular-route/angular-route.js',
        BOWER_COMP_ROOT + '/jquery/dist/jquery.js',
        BOWER_COMP_ROOT + '/bootstrap/dist/js/bootstrap.js',
        BOWER_COMP_ROOT + '/threejs/build/three.js',
        BOWER_COMP_ROOT + '/libs/*.js'
    ],
    tests = [TESTS_ROOT + '/*.js'];

// Concatenate JS - TESTS
gulp.task('test', function () {
    return gulp.src(tests)
        .pipe(concat('tests-all.js'))
        .pipe(gulp.dest(DIST_ROOT + '/tests'))
});

gulp.task('styles', function () {
    return gulp.src(styles)
        .pipe(less({style: 'expanded'}))
        .pipe(gulp.dest(DIST_ROOT + '/css/expanded'));
});

gulp.task('cssmin', function () {
    gulp.src(css)
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
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
gulp.task('appscripts', function () {
    return gulp.src(scripts)
        .pipe(concat('aidemo.js'))
        .pipe(gulp.dest(DIST_ROOT))
        .pipe(rename('aidemo.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(DIST_ROOT));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch(scripts, ['lint', 'appscripts', 'test']);
    gulp.watch(scss, ['styles', 'cssmin']);
    gulp.watch(tests, ['test']);
});

// Default Task
gulp.task('default', ['lint', 'libs', 'appscripts', 'styles', 'cssmin', 'test']);
