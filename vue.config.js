'use strict'
const path = require('path')
const isProduction =
    (process.env.NODE_ENV === process.env.NODE_ENV) !== 'development' // 开发和测试环境一样的配置
let devNeedCdn = false // 本地是否需要注入cdn
const CompressionPlugin = require('compression-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, dir)
}

// 声明cdn的配置
const cdn = {
    css: ['https://cdn.jsdelivr.net/npm/vant@2.5/lib/index.css'],
    js: [
        'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js',
        'https://cdn.jsdelivr.net/npm/vant@2.5/lib/vant.min.js',
        'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js',
        'https://cdn.bootcss.com/axios/0.19.0/axios.min.js',
        'https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js',
        // 'https://cdn.bootcss.com/echarts/4.3.0/echarts-en.common.min.js'
    ],
    // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
    externals: {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        // echarts: 'echarts',
        vant: 'vant',
    },
}
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */
    publicPath: process.env.BASE_URL,

    // publicPath: './',
    outputDir: 'dist',

    assetsDir: 'static',
    productionSourceMap: false,

    css: {
        loaderOptions: {
            scss: {
                // 配置全局的公共样式
                prependData: `@import "~@/styles/_variable.scss"; @import "~@/styles/_mixins.scss";`,
            },
        },
    },

    // 在开发环境保存修复
    lintOnSave: process.env.NODE_ENV === 'development',

    // eslint报错遮罩
    devServer: {
        open: true,
        overlay: {
            warnings: false,
            errors: true,
        },
        proxy: {
            // change xxx-api/login => mock/login
            // detail: https://cli.vuejs.org/config/#devserver-proxy
            [process.env.VUE_APP_BASE_API]: {
                target: `http://0.0.0.0:8090`, // api地址
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: '',
                },
            },
        },
    },
    configureWebpack: config => {
        if (isProduction || this.devServer) {
            // 使用externals设置排除项
            config.externals = cdn.externals
        }
    },
    chainWebpack(config) {
        config.plugins.delete('preload') // TODO: need test
        config.plugins.delete('prefetch') // TODO: need test
        // 配置别名
        config.resolve.alias.set('@', resolve('src'))

        // set svg-sprite-loader 配置雪碧图
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
            })
            .end()

        // set preserveWhitespace
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace = true
                return options
            })
            .end()

        // 生产环境和测试环境注入cdn
        config.plugin('html').tap(args => {
            if (isProduction || devNeedCdn) args[0].cdn = cdn
            return args
        })

        /* 开发环境 */
        config
            // https://webpack.js.org/configuration/devtool/#development
            .when(process.env.NODE_ENV === 'development', config =>
                config.devtool('cheap-source-map')
            )

        /* 非开发环境 */
        config.when(process.env.NODE_ENV !== 'development', config => {
            config
                .plugin('ScriptExtHtmlWebpackPlugin')
                .after('html')
                .use('script-ext-html-webpack-plugin', [
                    {
                        // `runtime` must same as runtimeChunk name. default is `runtime`
                        inline: /runtime\..*\.js$/,
                    },
                ])
                .end()
            config.optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        name(module) {
                            const packageName = module.context.match(
                                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                            )[1]
                            return `npm.${packageName.replace('@', '')}`
                        },
                        test: /[\\/]node_modules[\\/]/,
                        minChunks: 1,
                        maxInitialRequests: 5,
                        minSize: 0,
                        priority: 100,
                        chunks: 'initial', // only package third parties that are initially dependent
                    },
                    styles: {
                        name: 'styles',
                        test: /\.(sa|sc|c)ss$/,
                        chunks: 'all',
                        enforce: true,
                    },
                    vantUI: {
                        name: 'chunk-vantUI', // split vantUI into a single package
                        priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                        test: /[\\/]node_modules[\\/]_?vant(.*)/, // in order to adapt to cnpm
                    },
                    commons: {
                        name: 'chunk-commons',
                        test: resolve('src/components'), // can customize your rules
                        minChunks: 3, //  minimum common number
                        priority: 5,
                        reuseExistingChunk: true,
                    },
                },
            })
            config.optimization.runtimeChunk('single')
            config.optimization.minimize(true)

            // 文件压缩
            config.plugin('compressionPlugin').use(
                new CompressionPlugin({
                    test: /\.js$|\.html$|.\css/, // 匹配文件名
                    threshold: 10240, // 对超过10k的数据压缩
                    deleteOriginalAssets: false, // 不删除源文件
                })
            )
        })

        /* 生产环境 */
        config.when(process.env.NODE_ENV === 'production', config => {
            // 删除生产环境的console.log注释
            config.optimization.minimizer('terser').tap(args => {
                args[0].terserOptions.compress.drop_console = true
                return args
            })
        })
    },
}
