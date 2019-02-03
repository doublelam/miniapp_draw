import { getConfig } from "./config";

const JSON_CON = require("./app.json");
const CONFIG_JSON = require("./project.config.json");
const APP_SASS = require("./app.sass");
const pathIcons = [
  require("./sources/images/icons8-home-o-81.png"),
  require("./sources/images/icons8-home-81.png"),
  require("./sources/images/icons8-create-o-81.png"),
  require("./sources/images/icons8-create-81.png"),
  require("./sources/images/icons8-fire-o-81.png"),
  require("./sources/images/icons8-fire-81.png"),
];
App({
  data: {
    backgroundColor: "#607d8b",
  },

  onLaunch: () => {
    const cloudEnv = getConfig.cloundFuncEnv;
    console.log(cloudEnv);
    wx.cloud.init({env: cloudEnv});
  },
});
