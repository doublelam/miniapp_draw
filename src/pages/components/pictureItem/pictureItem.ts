import { WxCloud } from "../../../common/WxCloud";
import { UsersPic } from "../../home/home";

require("./pictureItem.wxml");
require("./pictureItem.sass");
require("./pictureItem.json");
interface IndexData {
  picItem?: UsersPic;
  liked?: boolean;
  selfLike?: {avatarUrl: string} | {};
}
class Index implements IComponent<IndexData> {
  public data: IndexData;
  public properties;
  public methods;
  public options;
  constructor() {
    const that = this;
    this.data = {
      liked: false,
      selfLike: {},
    };
    this.methods = {
      jumpToDetail(e) {
        const { picId } = e.currentTarget.dataset;
        wx.navigateTo({
          url: `/pages/pictureDetail/pictureDetail?picId=${picId}`,
        });
      },
      onLike(e) {
        that.onLike.call(this, e);
      },
    };
    this.options = {
      addGlobalClass: true,
    };
    this.properties = {
      picItem: {
        type: Object,
        value: {},
      },
    };
  }

  private onLike(e) {
    console.log("__this", this);
    if (!e.detail || !e.detail.userInfo) {
      wx.showModal({
        confirmText: "知道了",
        content: "小程序需要使用您的昵称及头像用于展示点赞数量",
        showCancel: false,
        title: "提示",
      });
      return;
    }
    const { userInfo } = e.detail;
    const { picId } = e.target.dataset;
    WxCloud.cFun({
      data: {
        picId,
        type: "add",
        user: userInfo,
      },
      name: "likePic",
    }).then(res => {
      if (res.result && res.result.success) {
        console.log("this__", this);
        this.setData({
          liked: true,
          selfLike: userInfo,
        });
      }
    });
  }

}

interface Index {
  setData(data: IndexData, callback?: () => void): void;
}

Component(new Index());
