!function(t){var e={};function n(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(o,i,function(e){return t[e]}.bind(null,i));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="build/",n(n.s=3)}({0:function(t,e,n){"use strict";var o=this&&this.__assign||Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t};e.__esModule=!0;var i=function(){function t(){}return t.cFun=function(t){return new Promise(function(e,n){wx.cloud.callFunction(o({},t,{fail:function(t){n(t)},success:function(t){e(t)}}))})},t.uploadFile=function(t){return new Promise(function(e,n){wx.cloud.uploadFile(o({},t,{fail:function(t){n(t)},success:function(t){e(t)}}))})},t}();e.WxCloud=i},1:function(t,e,n){t.exports=n.p+"pages/pictureDetail/pictureDetail.json"},2:function(t,e,n){t.exports=n.p+"pages/pictureDetail/pictureDetail.wxml"},3:function(t,e,n){"use strict";e.__esModule=!0;var o=n(0);n(2),n(30),n(1);var i=function(){function t(){console.log("LAUNCH HOME"),this.data={commentVal:"",comments:[],detail:{},liked:!1,picId:"",selfLike:{},userInfo:{}}}return t.prototype.onLoad=function(t){var e=this,n=t.picId;this.setData({picId:n}),this.getDetail(n).then(function(t){e.setData({detail:t.result.data})}),this.getComments(n)},t.prototype.onLike=function(t){var e=this;if(t.detail&&t.detail.userInfo){var n=t.detail.userInfo,i=t.target.dataset.picId;o.WxCloud.cFun({data:{picId:i,type:"add",user:n},name:"likePic"}).then(function(t){t.result&&t.result.success&&e.setData({liked:!0,selfLike:n})})}else wx.showModal({confirmText:"知道了",content:"小程序需要使用您的昵称及头像用于展示点赞数量",showCancel:!1,title:"提示"})},t.prototype.onShareAppMessage=function(){return{title:this.data.detail.user.nickName+"的绘画作品"}},t.prototype.jumpToDraw=function(){wx.switchTab({url:"/pages/index/index"})},t.prototype.onSendComment=function(t){var e=this;if(t.detail&&t.detail.userInfo){var n=this.data.commentVal,i=t.currentTarget.dataset.picId;o.WxCloud.cFun({data:{comment:n,info:t.detail.userInfo,picId:i,type:"add"},name:"commentPic"}).then(function(t){t.result&&(wx.showToast({title:"发送成功",icon:"success"}),e.setData({commentVal:""}),e.getComments(i))})}else wx.showModal({confirmText:"知道了",content:"小程序需要使用您的昵称及头像用于展示评论内容",showCancel:!1,title:"提示"})},t.prototype.onInputChange=function(t){var e=t.detail.value;this.setData({commentVal:e})},t.prototype.getComments=function(t){var e=this;return o.WxCloud.cFun({data:{picId:t,type:"get"},name:"commentPic"}).then(function(t){return console.log("get comments",t),e.setData({comments:t.result.data}),t})},t.prototype.getDetail=function(t){return o.WxCloud.cFun({data:{picId:t,type:"detail"},name:"getAllPics"})},t}();Page(new i)},30:function(t,e){}});