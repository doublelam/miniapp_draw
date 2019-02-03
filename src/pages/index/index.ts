import { CanvasDrawable } from "../../common/canvas-draw";
import { COLORS, DEFAULTVALUE, STROKES } from "../../common/constants";
import { WxCloud } from "../../common/WxCloud";
require("./index.wxml");
require("./index.sass");
require("./index.json");

interface IndexData {
  colors?: Array<{
    name: string,
    value: string,
  }>;
  selectModal?: boolean;
  strokeModal?: boolean;
  menuShow?: boolean;
  color?: { name: string; value: string };
  stroke?: number;
  drawType?: string;
  strokes?: number[];
}

class Index implements IPage<IndexData> {
  public data: IndexData;
  private canvasDraw: CanvasDrawable;

  constructor() {
    this.data = {
      color: DEFAULTVALUE.color,
      colors: COLORS,
      drawType: "draw",
      menuShow: true,
      selectModal: false,
      stroke: DEFAULTVALUE.stroke,
      strokeModal: false,
      strokes: STROKES,
    };
  }

  public onReady(): void {
    const canvasContext = wx.createCanvasContext("draw-canvas");
    this.canvasDraw = new CanvasDrawable(canvasContext);
    this.getDefaultValues();
  }

  public touchStart(e): void {
    this.canvasDraw.touchStart(e);
  }

  public touchMove(e): void {
    this.canvasDraw.touchMove(e);
  }

  public showOrHiddenMenu(e): void {
    this.setData({
      menuShow: !this.data.menuShow,
    });
  }
  public showSelectModal(e?): void {
    this.setData({
      selectModal: true,
    });
  }

  public hideSelectModal(e?): void {
    this.setData({
      selectModal: false,
    });
  }

  public showStrokeModal(e?): void {
    this.setData({
      strokeModal: true,
    });
  }

  public hideStrokeModal(e?): void {
    this.setData({
      strokeModal: false,
    });
  }

  public onChangeStroke(e?): void {
    const { stroke } = e.target.dataset;
    this.setData({
      stroke,
    });
    setTimeout(() => {
      this.setData({
        strokeModal: false,
      });
    }, 200);
    wx.setStorage({
      data: stroke,
      key: "stroke",
    });
    this.canvasDraw.setStyle({
      width: stroke,
    });
  }

  public onChangeColor(e): void {
    const { color } = e.target.dataset;
    this.setData({
      color,
    });
    setTimeout(() => {
      this.setData({
        selectModal: false,
      });
    }, 200);
    wx.setStorage({
      data: color,
      key: "color",
    });
    this.canvasDraw.setStyle({
      color: color.value,
    });
  }

  public changeType(e?): void {
    const type = this.data.drawType;
    this.setData({
      drawType: this.data.drawType === "draw" ? "erase" : "draw",
    }, () => {
      const currentType = this.data.drawType;
      if (currentType === "draw") {
        this.canvasDraw.endraw();
      } else {
        this.canvasDraw.enerase(20);
      }
    });
  }

  public onShareAppMessage(): wx.ShareOptions {
    return {
      title: "莫得感情的画布 分享你的绘画作品",
    };
  }

  public onUploadPic(e): void {
    if (!e.detail || !e.detail.userInfo) {
      wx.showModal({
        confirmText: "知道了",
        content: "发布图片需要获取您的昵称及头像用于展示",
        showCancel: false,
        title: "提示",
      });
      return;
    }
    wx.showModal({
      content: "确定发布图片吗？点击确定将发布图片并清空画布",
      success: res => {
        if (res.confirm) {
          wx.showToast({
            icon: "loading",
            title: "发布中",
          });
          this.uploadPic(e, () => {
            this.canvasDraw.cleanAll();
            wx.switchTab({url: "/pages/home/home"});
          });
        }
      },
      title: "提示",
    });
  }

  private uploadPic(e, callback?) {
    const userInfo = e.detail.userInfo;
    wx.canvasToTempFilePath({
      canvasId: "draw-canvas",
      quality: 1,
      success: data => {
        const tempPath = data.tempFilePath;
        const cloudPath = "customer_pics/" + tempPath.replace(/http|\:|\//g, "");
        WxCloud.uploadFile({
          cloudPath,
          filePath: tempPath,
        }).then(res => {
          const id = res.fileID;
          WxCloud.cFun({
            data: {
              fileId: id,
              type: "add",
              user: userInfo,
            },
            name: "customPics",
          }).then(re => {
            if (typeof callback === "function") {
              callback(re);
            }
          });
        });
      },
    });
  }

  private getDefaultValues(): void {
    ["color", "stroke"].map(v => {
      wx.getStorage({
        fail: () => {
          wx.setStorage({
            data: DEFAULTVALUE[v],
            key: v,
          });
        },
        key: v,
        success: res => {
          this.setData({
            [v]: res.data,
          });
          if (v === "color") {
            this.canvasDraw.setStyle({
              color: res.data.value,
            });
          }
          if (v === "stroke") {
            this.canvasDraw.setStyle({
              width: res.data,
            });
          }
        },
      });
    });
  }

}

interface Index {
  setData(data: IndexData, callback?: () => void): void;
}
Page(new Index());
