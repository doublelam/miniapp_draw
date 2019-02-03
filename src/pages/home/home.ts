import { WxCloud } from "../../common/WxCloud";

require("./home.wxml");
require("./home.sass");
require("./home.json");

export interface UsersPic {
  fileId?: string;
  likes?: wx.UserInfo;
  ifLiked?: boolean;
  user?: {
    nickName: string;
    avatarUrl: string;
  };
}
interface IndexData {
  pics?: UsersPic[];
  userInfo?: wx.UserInfo | {};
  pageIndex?: number;
  noPic?: boolean;
  loading?: boolean;
}

class Index implements IPage<IndexData> {
  public data: IndexData;
  private getPicTimeout: any;
  constructor() {
    console.log("LAUNCH HOME");
    this.data = {
      loading: false,
      noPic: false,
      pageIndex: 0,
      pics: [],
      userInfo: {},
    };
    this.getPicTimeout = NaN;
  }

  public onLoad(): void {
    this.getUserInfo();
  }

  public onShow(): void {
    this.setData({
      pageIndex: 0,
    }, () => {
      this.getAllPics();
    });
  }

  public onPullDownRefresh(): void {
    this.setData({
      pageIndex: 0,
    }, () => {
      this.getAllPics().then(_ => {
        wx.stopPullDownRefresh();
      });
    });
  }

  public onReachBottom(): void {
    if (this.data.noPic) {
      return;
    }
    this.setData({ loading: true });
    clearTimeout(this.getPicTimeout);
    this.getPicTimeout = setTimeout(() => {
      this.getAllPics().then(res => {
        this.setData({ loading: false });
      });
    }, 500);
  }

  public onLike(e) {
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
    }).then(res => { console.log("like pic res", res); });
  }

  public onShareAppMessage(): wx.ShareOptions {
    return {
      title: "莫得感情的画布 分享你的绘画作品",
    };
  }

  private getUserInfo(): void {
    wx.getUserInfo({
      success: res => {
        this.setData({
          userInfo: res.userInfo,
        });
      },
      withCredentials: false,
    });
  }

  private getAllPics(): Promise<{ result: any }> {
    return WxCloud.cFun({
      data: {
        orders: [["createdAt", "desc"]],
        pagination: {
          pageIndex: this.data.pageIndex,
          pageNum: 10,
        },
        type: "pics",
      },
      name: "getAllPics",
    }).then(data => {
      const picData = this.data.pageIndex <= 0
        ? data.result.data
        : this.data.pics.concat(data.result.data);
      this.setData({
        pageIndex: this.data.pageIndex + 1,
        pics: picData,
      });
      if (!data.result.data.length) {
        this.setData({ noPic: true });
      }
      console.log("pic data", picData);
      return data;
    });
  }

}
interface Index {
  setData(data: IndexData, callback?: () => void): void;
}
Page(new Index());
