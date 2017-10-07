var gulp = require('gulp')
var cssSass = require('gulp-sass')
var cssAutoprefixer = require('gulp-autoprefixer')
var jsConcat = require('gulp-concat')
var jsBabel = require('gulp-babel')
var jsUglify = require('gulp-uglify')
var imgImagemin = require('gulp-imagemin')
var imgCache = require('gulp-cache')
var browserSync = require('browser-sync').create()
var merge = require('merge-stream')

// Development tasks:
// //////////////////////////////////////////////////////////////////

// Deafult task
gulp.task('default', function () {
  console.log('Welcome to project base')

  // init browserify
  browserSync.init({
    server: './src'
  })

  // watch sass files **
  gulp.watch('./src/css/**/*', ['css'])
  // watch js files **
  gulp.watch('./src/js/**/*', ['js'])

  // watch sass files for autoreload
  gulp.watch('./src/css/*').on('change', browserSync.reload)
})

// CSS tasks
gulp.task('css', function () {
  return gulp.src('./src/css/main.scss')
  .pipe(cssSass().on('error', cssSass.logError))
  .pipe(gulp.dest('./src/css'))
})

// JS tasks
gulp.task('js', function () {
  return gulp.src(['./src/js/vendor/*.js', './src/js/modules/*.js', './src/js/custom.js'])
  .pipe(jsConcat('main.js'))
  .pipe(jsBabel({
    presets: ['env']
  }))
  .pipe(gulp.dest('./src/js'))
})

// Build tasks:
// //////////////////////////////////////////////////////////////////

// Build task
gulp.task('build', ['build_css', 'build_js', 'build_img', 'build_copy'])

// Build CSS tasks
gulp.task('build_css', function () {
  return gulp.src('./src/css/main.scss')
  .pipe(cssSass({outputStyle: 'compressed'}))
  .pipe(cssAutoprefixer())
  .pipe(gulp.dest('./build/css'))
})

// Build JS tasks
gulp.task('build_js', function () {
  return gulp.src(['./src/js/vendor/*.js', './src/js/modules/*.js', './src/js/custom.js'])
  .pipe(jsConcat('main.js'))
  .pipe(jsBabel({
    presets: ['env']
  }))
  .pipe(jsUglify())
  .pipe(gulp.dest('./build/js'))
})

// Build IMG tasks
gulp.task('build_img', function () {
  return gulp.src('src/images/**/*')
    .pipe(imgCache(imgImagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('build/images'))
})

// Copy static files
gulp.task('build_copy', function () {
  var files = gulp.src('./src/*')
    .pipe(gulp.dest('./build'))
  var fonts = gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./build/fonts'))
  return merge(files, fonts)
})
