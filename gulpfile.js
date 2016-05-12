/*
 * @author ojourmel
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var cleancss = require('gulp-clean-css');
var utils = require('gulp-util');
var riot = require('gulp-riot');

var TARGET = './build';
var SOURCE = './src';

/*
 * Static dependencies
 * Not watched
 */
gulp.task('includes', function() {
    gulp.src('node_modules/riot/riot.min.js')
        .pipe(gulp.dest(TARGET + '/js/riot/'));
});

/*
 * Minified and concatenated js files
 */
gulp.task('scripts', function() {
    gulp.src(SOURCE + '/js/omp/*.js')
        .pipe(uglify().on('error',utils.log))
        .pipe(concat('omp.js').on('error',utils.log))
        .pipe(gulp.dest(TARGET + '/js/omp/'))
});

/*
 * Minified seperate css and sass files
 */
gulp.task('styles', function() {
    gulp.src(SOURCE + '/css/omp/*.scss')
        .pipe(sass().on('error',utils.log))
        .pipe(cleancss().on('error',utils.log))
        .pipe(gulp.dest(TARGET + '/css/omp'));
    gulp.src(SOURCE + '/css/*.css')
        .pipe(cleancss().on('error',utils.log))
        .pipe(gulp.dest(TARGET + '/css'));
});

/*
 * Static HTML files. Not modified
 */
gulp.task('source', function() {
    gulp.src(SOURCE + '/*.html')
        .pipe(gulp.dest(TARGET + '/'));
});

/*
 * Riot tags compiled, minified, and concatenated
 */
gulp.task('riot', function() {
    gulp.src(SOURCE + '/tag/*.tag')
        .pipe(riot().on('error',utils.log))
        .pipe(uglify().on('error',utils.log))
        .pipe(concat('tags.js').on('error',utils.log))
        .pipe(gulp.dest(TARGET + '/js/omp/'));
});

/*
 * Watch all js, css, sass, html, and tag files
 */
gulp.task('watch', function() {
    gulp.watch([SOURCE + '/js/omp/*.js'],
               ['scripts']);

    gulp.watch([SOURCE + '/css/omp/*.scss',
                SOURCE + '/css/*.css'],
               ['styles']);

    gulp.watch([SOURCE + '/*.html'],
               ['source']);

    gulp.watch([SOURCE + '/tag/*.tag'],
               ['riot']);
});

/*
 * Main dev entry point
 */
gulp.task('automate', ['default', 'watch']);

/*
 * Production entry point uses simply 'gulp default'
 */
gulp.task('default', ['includes', 'scripts', 'styles', 'source', 'riot']);

/*
 * Manual wipe of TARGET dir
 */
gulp.task('clean', function() {
    return gulp.src(TARGET + '/*', {read: false})
               .pipe(clean().on('error',utils.log));
});
