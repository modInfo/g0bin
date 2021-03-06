'use strict';

//npm install gulp gulp-minify-css gulp-clean gulp-cleanhtml gulp-uglify-es gulp-zip run-sequence --save-dev

var gulp = require('gulp'),
	clean = require('gulp-clean'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify-es').default,
	concat = require('gulp-concat'),
	zip = require('gulp-zip'),
	runSequence = require('run-sequence');

//clean assets directory
gulp.task('clean', function() {
	return gulp.src(['assets/*', 'dist/*'], {read: false})
		.pipe(clean());
});

gulp.task('optimize-app-js', function() {
	return gulp.src(['static/js/app/jquery-1.7.2.min.js', 'static/js/app/sjcl.js', 'static/js/app/behavior.js'])
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets/js'))
});

gulp.task('optimize-libs-js', function() {
	return gulp.src('static/js/libs/*.js')
		.pipe(concat('libs.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets/js'))
});

gulp.task('optimize-css', function() {
	return gulp.src('static/css/*.css')
		.pipe(concat('app.css'))
		.pipe(minifycss({keepSpecialComments: 0}))
		.pipe(gulp.dest('assets/css'))
});

gulp.task('copy', function() {
	return gulp.src('static/img/*')
		.pipe(gulp.dest('assets/img'));
});

gulp.task('build', function() {
		gulp.src('assets/**')
		.pipe(gulp.dest('dist/assets'));

		gulp.src(['templates/*.html'])
		.pipe(gulp.dest('dist/templates'));

	return gulp.src(['pastes/', 'config.json', 'gbin'])
		.pipe(gulp.dest('dist'));
});

/*gulp.task('release', ['optimize-app-js', 'optimize-libs-js', 'optimize-css', 'copy', 'build'], function() {
		var config = require('./config.json'),
		distFileName = 'gbin_v' + config.Version + '.zip';
	
	return gulp.src('dist/**')
		.pipe(zip(distFileName))
		.pipe(gulp.dest('release'));
});*/

gulp.task('release', function() {
    runSequence('optimize-app-js', 'optimize-libs-js', 'optimize-css', 'copy', 'build', function() {
		var config = require('./config.json'),
		distFileName = 'gbin_v' + config.Version + '.zip';
	
		return gulp.src('dist/**')
			.pipe(zip(distFileName))
			.pipe(gulp.dest('release'));
	});
});

gulp.task('default', ['clean'], function() {
	gulp.start('release');
});