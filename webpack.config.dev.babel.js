
import path from 'path';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import baseConfig from './webpack.config.base';

const url = 'baidu.com';

export default webpackMerge(baseConfig, {
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        // 配置全局变量
        new webpack.DefinePlugin({
            __DEV__: true,
        }),
    ],
    devServer: {
        host: '0.0.0.0',
        port: '8081',
        inline: true,
        compress: true,
        disableHostCheck: true,
        // historyApiFallback
        publicPath: '/',
        contentBase: path.join(__dirname, 'public'),
        proxy: {
            target: url,
            changeOrigin: true,
            onProxyReq: proxyReq => {
                if (proxyReq.getHeader('origin')) {
                    proxyReq.setHeader('origin', url);
                }
            },
        }
    }
});
