const dist = 'dist';
const distClient = `${dist}/client`;
const src = 'src';
const srcClient = `${src}/client`;

exports.paths = {
    dist: {
        client: {
            root: distClient,
        },
        root: dist,
    },
    src: {
        client: {
            root: srcClient,
        },
        root: src,
        server: {
            root: `${src}/server`,
        },
    },
};
