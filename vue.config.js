module.exports = {
  productionSourceMap: false,
  parallel: false,
  filenameHashing: false,
  devServer: {
    proxy: "http://localhost:8080"
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: "src/background.js"
    }
  }
};
