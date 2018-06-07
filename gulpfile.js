/*jslint node: true, nomen: true */
"use strict";

var gulp = require('gulp'),
    path = require('path'),
    gulpif = require('gulp-if'),
    rimraf = require('gulp-rimraf'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    extractor = require('gulp-extract-sourcemap'),
    minifyjs = require('gulp-uglify'),
    minifyjson = require('gulp-json-minify'),
    merge = require('merge-stream'),
    pug = require('gulp-pug');

var production = process.env.NODE_ENV === 'production',
    base_path = process.env.BASE_PATH || '/';

if (production) {
    console.log('PRODUCTION BUILD');
} else {
    console.log('DEVELOPMENT BUILD');
}

gulp.task('clean', function () {
    return gulp.src('./public/*', {read: false, dot: true}).pipe(rimraf({ force: true }));
});

gulp.task('html', function () {
    return gulp.src('./client/index.pug')
        .pipe(pug({
            locals: {base_path: base_path},
            pretty: !production
        }))
        .pipe(gulp.dest('./public'));
});

gulp.task('images', function () {
    return gulp.src('./client/img/*').pipe(gulp.dest('./public/img'));
});

gulp.task('vendor', function () {
    return merge(
        gulp.src(['./node_modules/jquery/dist/jquery.js',
                './node_modules/backbone/backbone.js',
                './node_modules/jointjs/dist/joint.js',
                './node_modules/bootstrap/dist/js/bootstrap.js',
                './node_modules/bootstrap-notify/bootstrap-notify.js',
                './node_modules/file-saver/FileSaver.js',
                './node_modules/almost/dist/almost.js',
                './node_modules/almost-joint/dist/almost-joint.js'])
                .pipe(gulpif(!production, sourcemaps.init()))
                .pipe(minifyjs())
                .pipe(rename({suffix: '.min'}))
                .pipe(gulpif(!production, sourcemaps.write('./')))
                .pipe(gulp.dest('./public/js')),
        gulp.src('./node_modules/lodash/index.js')
                .pipe(rename('lodash.js'))
                .pipe(gulpif(!production, sourcemaps.init()))
                .pipe(minifyjs())
                .pipe(rename({suffix: '.min'}))
                .pipe(gulpif(!production, sourcemaps.write('./')))
                .pipe(gulp.dest('./public/js')),
        gulp.src('./node_modules/knockout/build/output/knockout-latest.debug.js')
                .pipe(rename('knockout.js'))
                .pipe(gulpif(!production, sourcemaps.init()))
                .pipe(minifyjs())
                .pipe(rename({suffix: '.min'}))
                .pipe(gulpif(!production, sourcemaps.write('./')))
                .pipe(gulp.dest('./public/js')),
        gulp.src(['./node_modules/jointjs/dist/joint.css',
                './node_modules/bootstrap/dist/css/bootstrap.css',
                './node_modules/almost-joint/dist/almost-joint.css'])
                .pipe(gulpif(!production, sourcemaps.init()))
                .pipe(minifyCss({compatibility: 'ie8'}))
                .pipe(rename({suffix: '.min'}))
                .pipe(gulpif(!production, sourcemaps.write('./')))
                .pipe(gulp.dest('./public/css')),
        gulp.src('./node_modules/bootstrap/dist/fonts/**').pipe(gulp.dest('./public/fonts'))
    );
});

gulp.task('index', function () {
    return browserify({
        entries: './client/js/index.js',
        debug: !production,
    })
        .transform('exposify', {
            expose: {
                'jquery': '$',
                'lodash': '_',
                'backbone': 'Backbone',
                'knockout': 'ko',
                'joint': 'joint',
                'window': 'window',
                'navigator': 'navigator',
                'document': 'document',
                'atob': 'atob',
                'Uint8Array': 'Uint8Array',
                'Blob': 'Blob',
                'FileSaver': 'saveAs',
                'FileReader': 'FileReader',
                'URL': 'URL',
                'Worker': 'Worker',
                'almost': 'almost',
                'almost-joint': 'almost.plugins.joint'
            }
        })
        .transform('stringify', {
            extensions: ['.svg', '.html'],
            minify: production,
            minifyOptions: {
                removeComments: false
            }
        })
        .transform('ejsify')
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(gulpif(!production, extractor({
            basedir: path.join(__dirname, './client/js/'),
            fakeFix: true
        })))
        .pipe(gulpif(production, minifyjs()))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('sass', function () {
    return gulp.src('./client/index.scss')
        .pipe(gulpif(!production, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(rename('editor.min.css'))
        .pipe(gulpif(!production, sourcemaps.write('./')))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('build', ['html', 'index', 'vendor', 'sass', 'images']);

gulp.task('default', ['clean'], function () {
    return gulp.start('build');
});
