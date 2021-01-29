process.env.NODE_ENV = process.env.NODE_ENV || "development";

const env = process.env.NODE_ENV;

let envBasedConfig = {};

switch (env) {
  case "development":
  case "dev":
    envBasedConfig = require("./dev").config;
    break;

  case "test":
  case "testing":
    envBasedConfig = require("./testing").config;
    break;

  case "prod":
  case "production":
    envBasedConfig = require("./prod").config;

  default:
    envBasedConfig = require("./dev").config;
}

export default envBasedConfig;
