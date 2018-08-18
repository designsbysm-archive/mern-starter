const { dest, src, watch } = require('gulp');
const changed = require('gulp-changed');
const { isDev } = require('./tools/environment');
const log = require('fancy-log');
const { paths } = require('./tools/paths');
const pump = require('pump');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('./tsconfig.json');

function buildServer(callback) {
    pump([
        src([`${paths.src.server.root}/**/*.{js,ts}`, '!/**/~*'], { sourcemaps: isDev() }),
        changed(paths.dist.root, { extension: '.js' }),
        tsProject(),
        dest(paths.dist.root, { sourcemaps: '.' }),
    ], err => {
        if (err) {
            log.error(err.message);
        }

        callback();
    });
}

function watchServer(callback) {
    watch([`${paths.src.server.root}/**/*.{js,ts}`], buildServer);
    callback();
}

exports.build = buildServer;
exports.watch = watchServer;
