const path = require('path');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const TSPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/classes/KonaPlayer.ts',
  output: {
    filename: 'kona-player.js',
    path: path.resolve(__dirname, '..', 'public'),
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: '/node_modules/',
      },
    ],
  },
  resolve: {
    plugins: [
      PnpWebpackPlugin,
      new TSPathsWebpackPlugin(),
    ],
    extensions: ['.tsx', '.ts', '.js'],
  },
  resolveLoader: {
    plugins: [
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },
};
