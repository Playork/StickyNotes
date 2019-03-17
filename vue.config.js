module.exports = {
  productionSourceMap: false,
  parallel: false,
  css: {
    extract: false
  },
  filenameHashing: false,
  devServer: {
    proxy: 'http://localhost:8080'
  }
}