const { src, dest, series, parallel, watch } = require('gulp');
const replace = require('gulp-replace');
const connect = require('gulp-connect');
const sass = require('gulp-sass');
const rename = require('gulp-rename');

sass.compiler = require('node-sass');

const dateObj = new Date();
const year = dateObj.getFullYear();
const month = dateObj.getMonth() + 1;
const today = dateObj.getDate();
const newdate = `${year}${month}${today}`;

const settings = {
  cdn: 'https://cdn.my-content-delivery-network.com/brand-name',
  brand: 'brandName',
  root: 'src',
  dist: 'dist',
  port: '9999',
  prod: 'production'
};

const server = (done) => {
  return connect.server({
    root: settings.dist,
		port: settings.port
  });
  done;
}

const moveFiles = (done) => {
  return src(`${settings.root}/index.html`)
  .pipe(replace('%DATE%', newdate))
  .pipe(dest(`${settings.dist}`));

  done;
}

const buildSCSS = (done) => {
  return src(`${settings.root}/scss/**.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({
      suffix: `.${newdate}.`
    }))
    .pipe(dest(`${settings.dist}/css`))
  done;
}

const build = (done) => {
  moveFiles();
  buildSCSS();

  done;
}

exports.dev = parallel([build, server])



