const dateObj = new Date();
const year = dateObj.getFullYear();
const month = dateObj.getMonth() + 1;
const today = dateObj.getDate();
const newdate = `${year}${month}${today}`;

const settings = {
  cdn: 'https://cdn.mediabrix.com/o38/campaigns/my-brand-name/',
  brand: 'brandName',
  root: 'src',
  dev: 'dist',
  port: '9999',
  prod: 'production'
};

const gulp = require('gulp');
const rename = require('gulp-rename');
const connect = require('gulp-connect');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const replace = require('gulp-replace');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

gulp.task('connect', () => {
  connect.server({
    root: settings.dev,
		port: settings.port
  });
});

gulp.task('move:dev', () => {
  gulp.src(`${settings.root}/index.html`)
    .pipe(replace('%DATE%', newdate))
    .pipe(gulp.dest(`${settings.dev}`));
  gulp.src(`${settings.root}/img/**`)
    .pipe(gulp.dest(`${settings.dev}/img`));
  gulp.src(`${settings.root}/js/starter.js`)
    .pipe(gulp.dest(`${settings.dev}/js`));
});

/**
  Styling Tasks
**/

gulp.task('build:sass', () => {
  gulp.src(`${settings.root}/scss/**.scss`)
    .pipe(sass(
      { outputStyle: 'compressed' }
    ).on('error', sass.logError))
    .pipe(rename({
      suffix: `.${newdate}`
    }))
    .pipe(gulp.dest(`${settings.dev}/css`));
});

gulp.task('minify:CSS', () => {
  return gulp.src(`${settings.dev}/css/base.css`)
    .pipe(replace('../', settings.cdn))
    .pipe(cleanCSS())
    .pipe(rename({
      basename: settings.brand,
      suffix: `.${newdate}.min`
    }))
    .pipe(gulp.dest(`${settings.prod}`));
});

/**
  Javascript Tasks
**/

gulp.task('build:js', () => {
  return gulp.src(`${settings.root}/js/base.js`)
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(rename({
      suffix: `.${newdate}`
    }))
    .pipe(gulp.dest(`${settings.dev}/js`));
});

gulp.task('minify:js', () => {
  return gulp.src(`${settings.dev}/js/base.js`)
    .pipe(uglify({
        mangle: false
    }))
    .pipe(rename({
      basename: settings.brand,
      suffix: `.${newdate}.min`
    }))
    .pipe(gulp.dest(`${settings.prod}`));
});

/**
  Optimization Tasks
**/

gulp.task('optimize:images', () => {
	return gulp.src(`${settings.dev}/images/**`)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(`${settings.prod}/images`));
});

gulp.task('optimize:html', () => {
  return gulp.src(`${settings.root}/base.html`)
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(rename({
    basename: settings.brand,
    suffix: `.${newdate}.min`
  }))
  .pipe(gulp.dest(`${settings.prod}`));
});

/**
  Gulp Named Tasks
**/

gulp.task('dev:watch', () => {
  gulp.watch(`${settings.root}/**/*`, ['build']);
});

gulp.task('dev', ['build', 'connect', 'dev:watch']);
gulp.task('build', ['move:dev', 'build:sass', 'build:js']);
gulp.task('production', ['minify:CSS', 'minify:js', 'optimize:images', 'optimize:html']);
