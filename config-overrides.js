const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = function override(config, env) {
  config.module.rules.push(
    {
      test: /\.(wasm|bin|obj)$/i,
      include: [path.resolve(__dirname, "node_modules/deepar/")],
      type: "asset/resource",
    },
    {
      include: [path.resolve(__dirname, "effects/")],
      type: "asset/resource",
    }
  );

  config.resolve.alias = {
    ...config.resolve.alias,
    "@effects": path.resolve(__dirname, "effects/"),
  };

  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        { from: "public", to: "" },
        { from: "node_modules/deepar", to: "deepar-resources" },
      ],
    })
  );

  return config;
};
