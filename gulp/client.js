const { dest, src, watch } = require("gulp");
const { isDev, isProd } = require("./tools/environment");
const concat = require("gulp-concat");
const gulpif = require("gulp-if");
const ngAnnotate = require("gulp-ng-annotate");
const { paths } = require("./tools/paths");
const pump = require("pump");
const terser = require("gulp-terser");

function buildClient(callback) {
  pump(
    [
      src([
        `${paths.src.client.js}/module.js`,
        `${paths.src.client.js}/**/*.js`,
        "!/**/~*", 
      ], {
        sourcemaps: isDev(),
      }),
      ngAnnotate(),
      concat("client.min.js"),
      gulpif(isProd(), terser()),
      dest(paths.dist.client.js, { sourcemaps: "." }),
    ],
    err => {
      if (err) {
        console.error(err.message);
      }

      callback();
    },
  );
}

function watchClient(callback) {
  watch([ `${paths.src.client.js}/**/*.js` ], buildClient);
  callback();
}

exports.build = buildClient;
exports.watch = watchClient;
