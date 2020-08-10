import { CanvasDrawable } from "../../common/canvas-draw";
import { COLORS, DEFAULTVALUE, STROKES } from "../../common/constants";
import { stringify } from "querystring";
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
  imgSrc?: string | null;
  loading?: boolean;
  imgHeight?: number;
}

class Index implements IPage<IndexData> {
  public data: IndexData;
  private canvasDraw: CanvasDrawable;
  private getIMGTimeOut: any;
  private imgSrc: string;

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
      imgSrc: null,
      loading: false,
      imgHeight: 0,
    };
  }

  public onReady(): void {
    const canvasContext = wx.createCanvasContext("draw-canvas");
    wx.getSystemInfo({
      success: (info) => {
        console.log('___info',info )
        this.setData({
          imgHeight: info.windowWidth * .8
        });
        
      }
    });
    this.canvasDraw = new CanvasDrawable(canvasContext);
    this.getDefaultValues();
  }

  public touchStart(e): void {
    this.canvasDraw.touchStart(e);
  }

  public touchMove(e): void {
    this.canvasDraw.touchMove(e);
  }

  public touchEnd(e): void {
    // 
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
    const { stroke } = e.currentTarget.dataset;
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
    const { color } = e.currentTarget.dataset;
    console.log(e.currentTarget)
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
      imageUrl: this.data.imgSrc,
    };
  }

  public onShareTimeline() {
    return {
      imageUrl: this.data.imgSrc,
    }
  }

  public generateIMG() {
    this.setData({
      loading: true,
    });
    wx.canvasToTempFilePath({
      canvasId: "draw-canvas",
      quality: 1,
      fail: () => {
        this.setData({
          loading: false,
        });
      },
      success: (path) => {
        console.log('path', path)
        this.imgSrc = path.tempFilePath;
        this.setData({
          imgSrc: this.imgSrc,
          loading: false,
        });
      }
    });
  }

  public clearAll(): void {
    this.canvasDraw.cleanAll();
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
          console.log('____st', v, res.data)
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
