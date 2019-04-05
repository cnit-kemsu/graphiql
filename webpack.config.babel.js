import fs from 'fs';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { DuplicatesPlugin } from 'inspectpack/plugin';
import CopyPlugin from 'copy-webpack-plugin';

export default function (env, { mode = 'development' }) {
  return mode === 'development' ? {

    devtool: 'inline-source-map',
    mode: 'development',
    cache: true,

    target: 'web',

    entry: './test/app.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      publicPath: '/'
    },

    module: {
      rules: [{

          test: /\.js$/,
          include: [
            'src',
            'node_modules/@kemsu',
            'test',
          ].map(_ => path.resolve(__dirname, _)),
          loader: 'babel-loader',
          options: fs.readFileSync('.babelrc') |> JSON.parse

        }, {

          test: /\.flow$/,
          loader: 'ignore-loader'

        }, {

          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
          ]
          
      }]
    },

    plugins: [
     new HtmlWebpackPlugin({
        title: 'graphiql',
        template: './test/index.html'
      }),
      new DuplicatesPlugin({}),
      new CopyPlugin([
        { from: './node_modules/graphiql/graphiql.css', to: '' }
      ])
    ],

    optimization: {
      namedChunks: true,
      namedModules: false,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            name: 'vendor',
            chunks: 'all'
          }
        }
      }
    },

    devServer: {
      proxy: {
        '/api': 'http://localhost:8080/graphql'
      },
      contentBase: './test/server',
      historyApiFallback: true,
      watchContentBase: true,
      port: 3000
    }

  } : {

    mode: 'production',

    target: 'web',

    entry: './src/comps/GraphiQL.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      //library: 'GraphiQL',
      libraryTarget: 'umd'
      //umdNamedDefine: true
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'babel-loader',
          options: fs.readFileSync('.babelrc') |> JSON.parse
        },
        {
          test: /\.flow$/,
          loader: 'ignore-loader'
        }
      ]
    },
    
    externals : [
      'react',
      'react-dom',
      'prop-types',
      //'graphql'
    ],

    plugins: [
      new DuplicatesPlugin({}),
      new CopyPlugin([
        { from: './node_modules/graphiql/graphiql.css', to: '' }
      ])
    ]

  };
}