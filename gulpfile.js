var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var clean = require('gulp-clean');

var TARGET = './build';
var SOURCE = './src';

gulp.task('scripts', function() {
    gulp.src(SOURCE + '/js/omp/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(TARGET + '/js/omp/'))
});

gulp.task('styles', function() {
    gulp.src(SOURCE + '/css/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(TARGET + '/css'));
});

gulp.task('source', function() {
    gulp.src(SOURCE + '/*.html')
        .pipe(gulp.dest(TARGET + '/'));
    gulp.src(SOURCE + '/tag/*.tag')
        .pipe(gulp.dest(TARGET + '/tag/'));
    gulp.src('node_modules/riot/riot+compiler.min.js')
        .pipe(gulp.dest(TARGET + '/js/riot/'));
});

gulp.task('watch', function() {
    gulp.watch([SOURCE + '/css/*.scss',
                SOURCE + '/js/omp/*.js',
                SOURCE + '/*.html',
                SOURCE + '/tag/*.tag'],
               ['scripts',
                'styles',
                'source']);
});

gulp.task('automate', ['default', 'watch']);

gulp.task('clean', function() {
    return gulp.src(TARGET + '/*', {read: false})
               .pipe(clean());
});

gulp.task('default', ['scripts', 'styles', 'source']);
