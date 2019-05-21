var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	del = require('del'),
	autoprefixer = require('gulp-autoprefixer')

//Compiling sass to css
gulp.task('sass', function() {
	return gulp.src(['dev/sass/*.sass', '!dev/sass/NightMode.sass']) // folder/sass/**/*.sass - all files from all folders in sass folder !folder/.../style.sass - all files exept style.sass
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%'], { cascade: true }))
	.pipe(gulp.dest('app/src/'))
	.pipe(browserSync.reload({stream: true}))
})

//Compiling sass to css for night mode
gulp.task('sass-nm', function() {
	return gulp.src('dev/sass/NightMode.sass') // folder/sass/**/*.sass - all files from all folders in sass folder !folder/.../style.sass - all files exept style.sass
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%'], { cascade: true }))
	.pipe(gulp.dest('app/public/'))
	.pipe(browserSync.reload({stream: true}))
})

//Getting all js libs in one
gulp.task('script-libs', function() {
	return gulp.src([
		'dev/libs/jquery/index.min.js',
		'dev/libs/popper-js/index.min.js',
		'dev/libs/bootstrap/dist/js/bootstrap.min.js',
		'dev/libs/fontawesome/js/all.js',
	])
	.pipe(concat('libs.min.js'))
	.pipe(gulp.dest('app/public/'))
})

//Getting all css libs in one
gulp.task('css-libs', function() {
	return gulp.src([
		'dev/libs/bootstrap/dist/css/bootstrap.min.css',
		'dev/libs/fontawesome/css/all.css',
		'dev/libs/animate-css/animate.css'
	])
  .pipe(concat('libs.css'))
	.pipe(gulp.dest('app/src/libs'))
})

//Browser auto update
gulp.task('browser-sync', function() {
	browserSync({
		proxy: "localhost",
		notify: false
	})
})

//Cleaning app folder from old files before running dev mode
gulp.task('clear-app', function() {
	return del.sync([
		'app/src/**/*.css',
		'app/public/libs.min.js'
	])
})

//Running project in dev mode
gulp.task('launch', ['browser-sync', 'clear-app', 'sass', 'sass-nm', 'css-libs', 'script-libs'], function() {
	gulp.watch('dev/sass/*.sass', ['sass'])
	gulp.watch('dev/sass/*.sass', ['sass-nm'])
})
