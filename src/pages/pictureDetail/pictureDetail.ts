import { WxCloud } from "../../common/WxCloud";

require("./pictureDetail.wxml");
require("./pictureDetail.sass");
require("./pictureDetail.json");

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
  detail?: UsersPic;
  userInfo?: wx.UserInfo | {};
  commentVal?: string;
  comments?: Array<{ [x: string]: any }>;
  picId?: string;
  liked?: boolean;
  selfLike?: { avatarUrl: string } | {};
}

class Index implements IPage<IndexData> {
  public data: IndexData;
  constructor() {
    console.log("LAUNCH HOME");
    this.data = {
      commentVal: "",
      comments: [],
      detail: {},
      liked: false,
      picId: "",
      selfLike: {},
      userInfo: {},
    };
  }

  public onLoad(options): void {
    const { picId } = options;
    this.setData({
      picId,
    });
    this.getDetail(picId).then(res => {
      this.setData({
        detail: res.result.data,
      });
    });
    this.getComments(picId);
  }

  public onLike(e): void {
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
        this.setData({
          liked: true,
          selfLike: userInfo,
        });
      }
    });
  }

  public onShareAppMessage(): wx.ShareOptions {
    return {
      title: `${this.data.detail.user.nickName}的绘画作品`,
    };
  }

  public jumpToDraw(): void {
    wx.switchTab({
      url: "/pages/index/index",
    });
  }

  public onSendComment(e): void {
    if (!e.detail || !e.detail.userInfo) {
      wx.showModal({
        confirmText: "知道了",
        content: "小程序需要使用您的昵称及头像用于展示评论内容",
        showCancel: false,
        title: "提示",
      });
      return;
    }
    const val = this.data.commentVal;
    const { picId } = e.currentTarget.dataset;
    WxCloud.cFun({
      data: {
        comment: val,
        info: e.detail.userInfo,
        picId,
        type: "add",
      },
      name: "commentPic",
    }).then(res => {
      if (res.result) {
        wx.showToast({ title: "发送成功", icon: "success" });
        this.setData({
          commentVal: "",
        });
        this.getComments(picId);
      }
    });
  }

  public onInputChange(v): void {
    const { value } = v.detail;
    this.setData({
      commentVal: value,
    });
  }

  private getComments(picId): Promise<{ result: any }> {
    return WxCloud.cFun({
      data: {
        picId,
        type: "get",
      },
      name: "commentPic",
    }).then(res => {
      console.log("get comments", res);
      this.setData({
        comments: res.result.data,
      });
      return res;
    });
  }

  private getDetail(picId): Promise<{ result: any }> {
    return WxCloud.cFun({
      data: {
        picId,
        type: "detail",
      },
      name: "getAllPics",
    });
  }
}
interface Index {
  setData(data: IndexData, callback?: () => void): void;
}
Page(new Index());
