"use strict ";

let gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	babel = require('gulp-babel'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	del = require('del'),
	cssmin = require('gulp-clean-css'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	browserSync = require('browser-sync'),
	jshint = require('gulp-jshint'),
	rigger = require('gulp-rigger'),
	plumber = require('gulp-plumber'),
	pug = require('gulp-pug'),
	pugLinter = require('gulp-pug-linter'),
	htmlValidator = require('gulp-w3c-html-validator');

gulp.task('clean', function () {
	del.sync('build/*');
});

/* const myReporter = (errors) => {
	errors.map(error => console.error(error.message));
};

gulp.task('pug', function () {
	return gulp.src('src/index.pug')
		.pipe(plumber())
		.pipe(pugLinter({ reporter: myReporter }))
		.pipe(pug({
			pretty: true
		}))
		.pipe(htmlValidator())
		.pipe(gulp.dest('build/'))
		.pipe(browserSync.reload({ stream: true }));
}); */

gulp.task('html', function () {
	return gulp.src('src/*.html')
		.pipe(plumber())
		.pipe(rigger())
		.pipe(gulp.dest('build/'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('libJS', function () {
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/slick-carousel/slick/slick.min.js',
	])
		.pipe(plumber())
		.pipe(concat('lib.js'))
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(sourcemaps.write())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('build/js/lib/'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function () {
	return gulp.src('src/js/**/*.js')
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('build/js/script/'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('libCSS', function () {
	return gulp.src([
		'node_modules/reset-css/reset.css',
		'node_modules/slick-carousel/slick/slick.css',
		'node_modules/animate.css/animate.min.css',
	])
		.pipe(plumber())
		.pipe(concat('lib.css'))
		.pipe(sourcemaps.init())
		.pipe(cssmin())
		.pipe(sourcemaps.write())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('build/css/lib'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('sass', function () {
	return gulp.src('src/sass/**/*.sass')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 8 versions'],
			overrideBrowserslist: ['last 2 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('build/css/style'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('image', function () {
	return gulp.src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
		.pipe(imagemin({
			progressive: true,
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest('build/images'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('fonts', function () {
	return gulp.src('src/fonts/**/*.*')
		.pipe(gulp.dest('build/fonts'));
});

gulp.task('watch', function () {
	gulp.watch('src/**/*.html', gulp.parallel('html'));
	gulp.watch('src/sass/**/*.sass', gulp.parallel('sass'));
	gulp.watch('src/js/**/*.js', gulp.parallel('js'));
	gulp.watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', gulp.parallel('image'));
	gulp.watch('src/fonts/**/*.*', gulp.parallel('fonts'));
});

gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: "build/"
		},
		// tunnel: true,
		host: 'localhost',
		port: 1096,
		logPrefix: "Frontend_Segey"
	});
});


// gulp.task('build', gulp.series('clean', gulp.parallel('html', 'sass', 'image', 'libJS', 'libCSS', 'js', 'browser-sync')));
// gulp.task('default', gulp.series('build', 'watch', gulp.parallel('html')));

gulp.task('build', gulp.series('clean'));
gulp.task('default', gulp.parallel('build', 'html', 'sass', 'fonts', 'image', 'libCSS', 'libJS', 'js', 'browser-sync', 'watch'));
