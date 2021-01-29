const chromedriver = require("chromedriver");

require("@babel/register")();

module.exports = {
  src_folders: ["test/acceptance"],
  webdriver: {
    start_process: true,
    server_path: chromedriver.path,
    port: 9515
  },
  // globals_path: "./test/acceptance/global.js",
  test_settings: {
    default: {
      desiredCapabilities: {
        browserName: "chrome"
      }
    }
  }
};
