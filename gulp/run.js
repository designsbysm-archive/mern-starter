const dotenv = require('dotenv');
const nodemon = require('gulp-nodemon');
const { paths } = require('./tools/paths');
const yargs = require('yargs');

// load .env variables
dotenv.config();

function nodeServer(callback) {
    let called = false;
    const options = {
        ext: 'js',
        ignore: [paths.dist.client.root],
        script: `${paths.dist.root}/server.js`,
        // verbose: true,
        watch: [paths.dist.root],
    };

    if (yargs.argv.inspect) {
        options.exec = 'node --inspect';
    }

    nodemon(options).on('start', () => {
        // to avoid nodemon being started multiple times
        if (!called) {
            called = true;
            callback();
        }
    });
}

exports.node = nodeServer;
