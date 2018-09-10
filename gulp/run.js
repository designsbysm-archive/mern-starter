const { series } = require('gulp');
const browserSync = require('browser-sync');
const dotenv = require('dotenv');
const nodemon = require('gulp-nodemon');
const { paths } = require('./tools/paths');
const yargs = require('yargs');

// load .env variables
dotenv.config();

function webServer(callback) {
    const options = {
        files: [`${paths.dist.root}/**/*`],
        notify: false,
        port: process.env.CLIENT_PORT,
        proxy: `http://localhost:${process.env.SERVER_PORT}/`,
        reloadDelay: 2000,
    };

    if (yargs.argv.page) {
        options.startPath = yargs.argv.page;
    }

    setTimeout(() => {
        browserSync(options);
        callback();
    }, 3000);
}

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

exports.web = series(nodeServer, webServer);
