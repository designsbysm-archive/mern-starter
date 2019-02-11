const dist = "dist";
const distClient = `${dist}/client`;
const src = "src";
const srcClient = `${src}/client`;

exports.paths = {
  dist: {
    client: {
      css: `${distClient}/css`,
      js: `${distClient}/js`,
      root: distClient,
    },
    root: dist,
  },
  src: {
    client: {
      js: `${srcClient}/js`,
      root: srcClient,
      styles: `${srcClient}/styles`,
    },
    root: src,
    server: {
      root: `${src}/server`,
    },
  },
};
