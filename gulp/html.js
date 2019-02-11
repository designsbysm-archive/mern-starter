const { dest, src, watch } = require("gulp");
const changed = require("gulp-changed");
const htmlmin = require("gulp-htmlmin");
const { paths } = require("./tools/paths");
const pump = require("pump");

function compressHTML(callback) {
  pump(
    [
      src([ `${paths.src.client.root}/**/*.html` ]),
      changed(paths.dist.client.root),
      htmlmin({ collapseWhitespace: true, removeComments: true }),
      dest(paths.dist.client.root),
    ],
    err => {
      if (err) {
        console.error(err.message);
      }

      callback();
    },
  );
}

function watchHTML(callback) {
  watch([ `${paths.src.client.root}/**/*.html` ], compressHTML);
  callback();
}

exports.compress = compressHTML;
exports.watch = watchHTML;
