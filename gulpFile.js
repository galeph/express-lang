var gulp = require('gulp');
var babel = require('gulp-babel');

var src = 'src/**/*.js';
var dist = 'lib';

gulp.task('default', function () {
  return gulp.src(src)
    .pipe(babel())
    .pipe(gulp.dest(dist));
});