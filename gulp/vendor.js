const { dest, src } = require("gulp");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const gulpif = require("gulp-if");
const { isDev, isProd } = require("./tools/environment");
const { paths } = require("./tools/paths");
const pump = require("pump");
const stream = require("merge-stream")();
const terser = require("gulp-terser");

paths.node = "./node_modules/";
paths.vendor = "./src/vendor/";

function buildVendor() {
  stream.add(
    pump(
      [
        src(
          [
            paths.node + "jquery/dist/jquery.js",
            paths.node + "angular/angular.js",
            paths.node + "angular-route/angular-route.js",
            paths.node + "bluebird/js/browser/bluebird.js",
            paths.node + "ngstorage/ngStorage.js",
            paths.vendor + "bootstrap/js/bootstrap.js",
          ],
          { sourcemaps: isDev() },
        ),
        concat("vendor.min.js"),
        gulpif(isProd(), terser()),
        dest(paths.dist.client.js, { sourcemaps: "." }),
      ],
      err => {
        if (err) {
          console.error(err.message);
        }
      },
    ),
    pump(
      [
        src([ paths.vendor + "bootstrap/css/bootstrap.css" ], { sourcemaps: isDev() }),
        concat("vendor.min.css"),
        cleanCSS({ compatibility: "ie8" }),
        dest(paths.dist.client.css, { sourcemaps: "." }),
      ],
      err => {
        if (err) {
          console.error(err.message);
        }
      },
    ),
  );

  return stream.isEmpty() ? null : stream;
}

exports.build = buildVendor;
