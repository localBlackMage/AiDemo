var gulp = require('gulp'),
    sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var httpServer = require('http-server');

var scss = ['../../css/sass/*.scss'];
var scripts = ['../src/utils/*.js', '../src/models/*.js',
    '../src/*.js', '../src/**/*.js'];
var css = ['../../css/*.css'];
var libs = ['../bower_components/angular/angular.js',
    '../bower_components/angular-route/angular-route.js',
    '../bower_components/jquery/dist/jquery.js',
    '../bower_components/bootstrap/dist/js/bootstrap.js'];

gulp.task('styles', function () {
    return gulp.src(scss)
        .pipe(sass({style: 'expanded'}))
        .pipe(gulp.dest('../../css'));
});

gulp.task('cssmin', function () {
    gulp.src(css)
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../../css/dist'));
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
        .pipe(gulp.dest('../dist'))
        .pipe(rename('libs-all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../dist'));
});

// Concatenate & Minify JS -- APP
gulp.task('appscripts', function () {
    return gulp.src(scripts)
        .pipe(concat('aidemo.js'))
        .pipe(gulp.dest('../dist'))
        .pipe(rename('aidemo.min.js'))
//            .pipe(uglify())
        .pipe(gulp.dest('../dist'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch(scripts, ['lint', 'appscripts']);
    gulp.watch(scss, ['styles']);
    gulp.watch(css, ['cssmin']);
});

// Default Task
gulp.task('default', ['lint', 'libs', 'appscripts', 'styles', 'cssmin']);
