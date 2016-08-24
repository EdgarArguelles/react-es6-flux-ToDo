'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect'); // Runs a local dev server
const open = require('gulp-open'); // Open a URL in a web browser
const bulkSass = require('gulp-sass-glob-import'); // Includes all SASS files into main one
const sass = require('gulp-sass'); // Compiles SASS files
const browserify = require('browserify'); // Bundles JS
const babel = require('babelify');  // Transforms React JSX to JS
const source = require('vinyl-source-stream'); // Use conventional text streams with Gulp
const argv = require('yargs').argv; // Allows send args to gulp tasks
const gulpif = require('gulp-if'); // Conditions the execution of a task
const buffer = require('vinyl-buffer'); // Use conventional text buffer with Gulp
const uglify = require('gulp-uglify'); // Uglify JS code
const eslint = require('gulp-eslint'); // Lint JS files, including JSX
const jest = require('jest-cli'); // Run test
const runSequence = require('run-sequence'); // Run tasks in sequence

const config = {
  port: 9005,
  devBaseUrl: 'http://localhost',
  paths: {
    html: './src/index.html',
    scss: './src/**/*.scss',
    js: './src/app/**/*.js',
    dist: './dist',
    mainScss: './src/main.scss',
    mainJs: './src/app/app.js'
  }
};

// Start a local development server
gulp.task('connect', () => {
  connect.server({
    root: ['dist'],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true
  });
});

// Open a URL in a web browser
gulp.task('open', () => {
  gulp.src('dist/index.html')
    .pipe(open({uri: config.devBaseUrl + ':' + config.port + '/'}));
});

// Move to dist folder HTML files
gulp.task('html', () => {
  gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
});

// Move assets to dist folder
gulp.task('assets', () => {
  gulp.src(['src/assets/**'])
    .pipe(gulp.dest(config.paths.dist + '/css'));
});

// Compile, bundle and move to dist SASS files
gulp.task('css', ['assets'], () => {
  gulp.src(config.paths.mainScss) // source of main SASS file
    .pipe(bulkSass()) // Includes all SASS files into main one
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // Process main SASS file
    .pipe(gulp.dest(config.paths.dist + '/css')) // Outputs generated CSS file
    .pipe(connect.reload());
});

// Transform, bundle and move to dist JSX code
gulp.task('js', () => {
  browserify(config.paths.mainJs, {debug: true})
    .transform(babel)
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest(config.paths.dist + '/scripts'))
    .pipe(connect.reload());
});

// Evaluate ES6 JSX code with ESLINT rules
gulp.task('eslint', () => {
  gulp.src(config.paths.js)
    .pipe(eslint())
    .pipe(eslint.format());
});

// Run tests
gulp.task('test', (done) => {
  jest.runCLI({
    config: {
      rootDir: './src/app',
      testRegex: '.*.spec.js',
      collectCoverage: true,
      verbose: true
    }
  }, ".", () => {
    done();
  });
});

// Watch changes and rebuild
gulp.task('watch', () => {
  gulp.watch(config.paths.html, ['html']);
  gulp.watch(config.paths.js, ['build-js']);
  gulp.watch(config.paths.scss, ['css']);
});

gulp.task('build-js', () => {
  runSequence(
    'eslint',
    'test',
    'js');
});

gulp.task('build', () => {
  runSequence(
    'html',
    'css',
    'build-js');
});

gulp.task('default', () => {
  runSequence(
    'html',
    'css',
    'eslint',
    'test',
    'js',
    'connect',
    'open',
    'watch');
});