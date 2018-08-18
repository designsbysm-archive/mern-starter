const del = require('del');
const { paths } = require('./tools/paths');

function cleanBuild() {
    return del([`${paths.dist.root}/**/*`]);
}

exports.build = cleanBuild;
