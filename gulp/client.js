const { dest, src, watch } = require('gulp');
const { isDev, isProd } = require('./tools/environment');
const gulpif = require('gulp-if');
const log = require('fancy-log');
const ngAnnotate = require('gulp-ng-annotate');
const { paths } = require('./tools/paths');
const pump = require('pump');
const terser = require('gulp-terser');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('./gulp/tools/tsconfig-ng.json');

function buildClient(callback) {
    pump([
        src([`${paths.src.client.js}/module.js`, `${paths.src.client.js}/**/*.{js,ts}`, '!/**/~*'], { sourcemaps: isDev() }),
        tsProject(),
        ngAnnotate(),
        gulpif(isProd(), terser()),
        dest(paths.dist.client.js, { sourcemaps: '.' }),
    ], err => {
        if (err) {
            log.error(err.message);
        }

        callback();
    });
}

function watchClient(callback) {
    watch([`${paths.src.client.js}/**/*.{js,ts}`], buildClient);
    callback();
}

exports.build = buildClient;
exports.watch = watchClient;
