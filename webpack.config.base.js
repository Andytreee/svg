
import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
    entry: {        
        main: ['babel-polyfill', './src/test.js']
    },
    output: {
        publicPath: '/',
        path: path.join(__dirname, 'build'),
        // filename: 'higgscharts.js',
        // library: 'higgscharts',
        // libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js', '.css'],
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: [path.join(__dirname, 'src')],
            use: ['babel-loader']
        }, {
            test: /\.css$/,
            include: [path.join(__dirname, 'src')],
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
            ],
        },  {
            test: /\.(gif|jpg|png|woff|svg|eot|ttf)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192
                }
            }]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new CaseSensitivePathsPlugin(),                      // 文件大小写检测
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({                                // 主页面入口index.html
            filename: 'index.html',
            template: './public/index.html',
            favicon: './public/favicon.ico',
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,                                 // 压缩loader读取的文件
            options: {
                postcss: function() {
                    return [autoprefixer];
                }
            }
        })
    ]
};
