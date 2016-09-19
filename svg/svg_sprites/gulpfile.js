'use strict';
var gulp = require("gulp");
var symbols = require("gulp-svg-symbols");
//转换svg
gulp.task('svg', function() {
  return gulp.src('./svg/**')
    .pipe(symbols())
    .pipe(gulp.dest('out/'));
});
