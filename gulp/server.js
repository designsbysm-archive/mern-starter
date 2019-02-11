const { dest, src, watch } = require("gulp");
const changed = require("gulp-changed");
const { isDev } = require("./tools/environment");
const { paths } = require("./tools/paths");
const pump = require("pump");

function buildServer(callback) {
  pump(
    [
      src([
        `${paths.src.server.root}/**/*.js`,
        "!/**/~*", 
      ], { sourcemaps: isDev() }),
      changed(paths.dist.root, { extension: ".js" }),
      // tsProject(),
      dest(paths.dist.root, { sourcemaps: "." }),
    ],
    err => {
      if (err) {
        console.error(err.message);
      }

      callback();
    },
  );
}

function watchServer(callback) {
  watch([ `${paths.src.server.root}/**/*.js` ], buildServer);
  callback();
}

exports.build = buildServer;
exports.watch = watchServer;
