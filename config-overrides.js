const path = require("path");

module.exports = {
  paths: paths => {
    paths.appBuild = path.resolve(__dirname, "build/client");
    paths.appIndexJs = path.resolve(__dirname, "src/client/index.jsx");
    paths.appSrc = path.resolve(__dirname, "src/client");
    return paths;
  },
};
