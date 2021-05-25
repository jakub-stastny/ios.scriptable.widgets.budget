import path from 'path'

// NOTE: __dirname is not defined, that's why I'm using process.cwd()
export default {
  target: 'node',
  mode: 'development',
  devtool: false,
  entry: path.join(process.cwd(), 'src/index.ts'),
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        // exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  output: {
    path: process.cwd(),
    filename: 'widget.bundle.js',
  }
}
