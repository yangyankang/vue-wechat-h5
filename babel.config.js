module.exports = {
    presets: ['@vue/cli-plugin-babel/preset'],
    // 设置vant自动按需加载
    plugins: [
        [
            'import',
            { libraryName: 'vant', libraryDirectory: 'es', style: true },
            'vant',
        ],
    ],
}
