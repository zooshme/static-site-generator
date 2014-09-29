var path = require('path');
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var nib = require('nib')
var jade = require('gulp-jade');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');


gulp.task('stylus', function() {
	gulp.src('./compile/stylus/styles.styl')
		.pipe(stylus({
			use: [nib()],
			sourcemap: {
				inline: true,
				sourceRoot: './compile/stylus',
				basePath: './build'
			}
		}))
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(sourcemaps.write('.', {
			includeContent: false,
			sourceRoot: './compile/stylus/'
		}))
		.pipe(gulp.dest('./build/css/'))
		.pipe(connect.reload());
});

gulp.task('jade', function() {
	gulp.src(['./compile/jade/**/*.jade', '!./compile/jade/partials/**/*.jade'])
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest('./build/'))
		.pipe(connect.reload());
});

gulp.task('connect', function() {
	connect.server({
		port: 3333,
		root: './',
		open: {browser: 'Google Chrome'}
	});
});

gulp.task('build', ['stylus', 'jade']);
gulp.task('upload', function() {

});

gulp.task('default', ['stylus', 'jade', 'connect']);
gulp.watch('./compile/jade/**/*.jade', ['jade']);
gulp.watch('./compile/stylus/**/*.styl', ['stylus']);