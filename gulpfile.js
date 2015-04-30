var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),

    minifyCss = require("gulp-minify-css"),
    minifyHtml = require("gulp-minify-html"),

    jshint = require('gulp-jshint');


var src = [
        '*.html',
        '*.js',
        'app/**/*.html',
        'public/assets/js/app/*.js'
    ];

var paths = {

    js:[
     'public/assets/js/**/*.js'
    ],
    css:[
     'public/assets/css/*.css'
    ],
    other:[
     '*.html',
      'app/**/*.html'
    ]
};

gulp.task('default', ['compress']);

gulp.task('compresslib', function() {
  return gulp.src([
          'public/assets/js/*.js'
         ])
         .pipe(uglify())
         .pipe(gulp.dest('public/dist/js'));
});

gulp.task('compress1', function() {
  return gulp.src('public/assets/js/*.js')
         .pipe(uglify())
         .pipe(gulp.dest('public/dist/js'));
});

// Minify HTML
gulp.task('minify-html', function () {
    gulp.src('views/index.html')
        .pipe(minifyHtml())
        .pipe(gulp.dest('views/dist'));
});

// Minify Css
gulp.task('minify-css', function () {
    gulp.src('public/assets/css/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('public/dist/css'));
});

/*
gulp.task('connect', function() {
    connect.server({
        root: __dirname,
        livereload: true,
        port: 8000
    });
});
gulp.task('watch', function() {
    gulp.watch('paths.js',['concat','reload']);
    gulp.watch('paths.other',['reload']);
});
*/
gulp.task('watch', function() {

});

gulp.task('concat', function() {    // include  mutiple files into one file
    gulp.src('public/assets/js/apps/**/*.js')
        .pipe(concat('app.min.js'))   
        .pipe(gulp.dest('public/assets/js/'));
});

/*

gulp.task('reload', function() {
    gulp.src(src)
        .pipe(connect.reload());
});
*/



