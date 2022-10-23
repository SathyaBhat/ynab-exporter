var gulp = require('gulp')
var ts = require('gulp-typescript')
var uglify = require('gulp-uglify')
var chmod = require('gulp-chmod')
var insert = require('gulp-insert')
var tsProject = ts.createProject('tsconfig.json')

function build() {
  return gulp.src('src/*.ts')
    .pipe(tsProject())
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
}

function release() {
  return gulp.src('dist/index.js')
    .pipe(insert.prepend(`#!/usr/bin/env node
`))
    .pipe(chmod(0o755))
    .pipe(gulp.dest('dist'))
}

exports.default = gulp.series(build, release)
