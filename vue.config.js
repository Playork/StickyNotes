// Vue Cli Config File
module.exports = {
  // Disable .map Of .js
  productionSourceMap: false,
  // Forgotten But Not Removing
  parallel: false,
  // Disable Extraction Of Css From .js
  css: {
    extract: false
  },
  // Disable Adding Random Names In Files
  filenameHashing: false,
  // Default Dev Server
  devServer: {
    proxy: "http://localhost:8080"
  }
};
