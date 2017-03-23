const gulp = require('gulp');
require('git-guppy')(gulp);
const mocha = require('gulp-mocha');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
gulp.task('default', ['test:unit']);

gulp.task('pre-commit', ['build:lint', 'build:babel']);

gulp.task('test:unit', ['build:lint'], () => {
  return gulp.src('test/**/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('build:lint', () => {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('build:babel', (callback) => {
  gulp.src(['src/**/*.js'], {base: './src'})
    .pipe(sourcemaps.init())
    .pipe(babel({presets: ['es2015']}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'))
    .on('end', () => callback());
});
