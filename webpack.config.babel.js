import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

export default function (env, { mode = 'development' }) {
  return mode === 'development' ? {

    devtool: 'inline-source-map',
    mode: 'development',
    target: 'web',

    entry: './example/index.js',

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
            'example',
          ].map(_ => path.resolve(__dirname, _)),
          loader: 'babel-loader'

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
        template: './example/index.html'
      }),
      new CopyPlugin({
        patterns: [
          { from: './node_modules/graphiql/graphiql.css', to: '' }
        ]
      })
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
      contentBase: './example/server',
      historyApiFallback: true,
      watchContentBase: true,
      port: 3000
    }

  } : {

    mode: 'production',

    target: 'web',

    entry: './src/GraphiQL.js',
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
      new CopyPlugin({
        patterns: [
          { from: './node_modules/graphiql/graphiql.css', to: '' }
        ]
      })
    ]

  };
}