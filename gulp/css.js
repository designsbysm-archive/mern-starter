const { dest, src, watch } = require("gulp");
const autoPrefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const { isDev } = require("./tools/environment");
const { paths } = require("./tools/paths");
const pump = require("pump");
const sass = require("gulp-sass");

function buildCSS(callback) {
  pump(
    [
      src([ `${paths.src.client.styles}/**/*.scss` ], { sourcemaps: isDev() }),
      concat("client.min.css"),
      sass({ outputStyle: "compressed" }),
      autoPrefixer("last 2 versions", "ie 9", "ios 6", "android 4"),
      dest(paths.dist.client.css, { sourcemaps: "." }),
    ],
    err => {
      if (err) {
        console.error(err.message);
      }

      callback();
    },
  );
}

function watchCSS(callback) {
  watch([ `${paths.src.client.styles}/**/*.scss` ], buildCSS);
  callback();
}

exports.build = buildCSS;
exports.watch = watchCSS;
