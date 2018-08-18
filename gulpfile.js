const { series, parallel } = require('gulp');
const bulk = require('bulk-require');
const tasks = bulk(__dirname, ['./gulp/**/*.js']).gulp;

exports.build = series(
    tasks.clean.build,
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
