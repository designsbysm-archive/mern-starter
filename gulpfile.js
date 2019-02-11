const { series, parallel } = require("gulp");
const bulk = require("bulk-require");
const tasks = bulk(__dirname, ["./gulp/**/*.js"]).gulp;

exports.clean = series(tasks.clean.build);

exports.build = series(
  this.clean,
  parallel(tasks.client.build, tasks.css.build, tasks.html.compress, tasks.server.build, tasks.vendor.build),
);

exports.default = series(
  this.build,
  parallel(tasks.client.watch, tasks.css.watch, tasks.html.watch, tasks.server.watch),
  tasks.run.web,
);
