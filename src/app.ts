import { getConfig } from "./config";

const JSON_CON = require("./app.json");
// const CONFIG_JSON = require("./project.config.json");
const APP_SASS = require("./app.sass");

App({
  data: {
    backgroundColor: "#607d8b",
  },

  onLaunch: () => {
    // const cloudEnv = getConfig.cloundFuncEnv;
    // console.log(cloudEnv);
    // wx.cloud.init({env: cloudEnv});
  },
});
