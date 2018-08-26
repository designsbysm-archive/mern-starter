const { series, parallel } = require('gulp');
const bulk = require('bulk-require');
const tasks = bulk(__dirname, ['./gulp/**/*.js']).gulp;

exports.clean = series(
    tasks.clean.build,
);

exports.build = series(
    this.clean,
    parallel(
        tasks.html.compress,
        tasks.server.build,
    ),
);

exports.default = series(
    this.build,
    parallel(
        tasks.html.watch,
        tasks.server.watch,
    ),
    tasks.run.node,
);
