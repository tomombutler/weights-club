var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var notify = require('gulp-notify');
var path = require('path');

// App CSS
gulp.task('css:app', function() {

    gulp
        .src(['assets/sass/main.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9'],
            cascade: false
        }))
        .pipe(cleanCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./assets/build/css/'))
        .on('error', function (err) {
            console.log('Error compiling CSS: ', err);
        })
        .pipe(notify({
            title: 'Successfully compiled CSS',
            message: 'All .scss files were successfully compiled into CSS',
            sound: false,
            icon: false,
            onLast: true
        }));
});

// --------------------------------------------------------------------------

//  App JS
gulp.task('js:app', function() {
    gulp
        .src([
            'assets/js/app.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.', {includeContent: false}))
        .pipe(gulp.dest('./assets/build/js/'))
        .on('error', notify.onError({
            message: 'Error compiling JS',
            title: '<%= error.message %>',
            sound: 'Funk',
            icon: false,
            onLast: true
        }))
        .on('error', function (err) {
            console.log('Error compiling JS: ', err);
        })
        .pipe(notify({
            title: 'Successfully compiled JS',
            message: 'All .js files were successfully minified and sourcemaps generated',
            sound: false,
            icon: false,
            onLast: true
        }));
});

// --------------------------------------------------------------------------

//  Watches for changes in JS or scss files and executes other tasks
gulp.task('default', function() {
    gulp.watch('assets/sass/**/*.scss',['css:app']);
    gulp.watch(['assets/js/*.js'],['js:app']);
});

//  Builds both CSS and JS
gulp.task('build', function() {
    runSequence(['css:app', 'js:app']);
});
