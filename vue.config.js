module.exports = {
    lintOnSave: false,
    runtimeCompiler: true,
    configureWebpack: {
        //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
        entry: ['@babel/polyfill', './src/main.js'],
        resolve: {
            symlinks: false
        }
    },
    transpileDependencies: ['@coreui/utils']
    // use this option for production linking
    // publicPath: process.env.NODE_ENV === 'production' ? '/vue/demo/3.0.0' : '/'
};
