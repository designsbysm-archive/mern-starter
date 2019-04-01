module.exports = api => {
  const isBabelServer = caller => {
    return !!(caller && (caller.name === "@babel/cli" || caller.name === "@babel/node"));
  };
  const isServer = api.caller(isBabelServer);
  api.cache(false);

  const presets = [];

  if (isServer) {
    presets.push([
      "@babel/preset-env",
      {
        targets: {
          node: "8",
        },
      },
    ]);
  } else {
    presets.push([ "react-app" ]);
  }

  const env = {
    debug: {
      retainLines: true,
      sourceMaps: "inline",
    },
  };

  return {
    env,
    presets,
  };
};
