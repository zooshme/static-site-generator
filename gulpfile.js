var path = require('path');
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var nib = require('nib')
var jade = require('gulp-jade');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var awspublish = require('gulp-awspublish');
var s3 = require('gulp-s3');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json'));
var publisher = awspublish.create({
	key: config.aws.key,
	secret: config.aws.secret,
	bucket: config.aws.bucket,
	region: config.aws.region
});


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
		.pipe(gulp.dest('./build/css/'));
});

gulp.task('jade', function() {
	gulp.src(['./compile/jade/**/*.jade', '!./compile/jade/partials/**/*.jade'])
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest('./build/'));
});

gulp.task('connect', function() {
	connect.server({
		port: 3333,
		root: './',
		open: {browser: 'Google Chrome'}
	});
});

gulp.task('build', ['stylus', 'jade']);

gulp.task('publish', function() {
	gulp.src('./build/**/*')
		.pipe(publisher.publish())
		.pipe(publisher.sync())
		.pipe(awspublish.reporter());
});

gulp.task('default', ['stylus', 'jade', 'connect']);
gulp.watch('./compile/jade/**/*.jade', ['jade']);
gulp.watch('./compile/stylus/**/*.styl', ['stylus']);