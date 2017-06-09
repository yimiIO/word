define("pages/music_player.js",["biz_wap/utils/mmversion.js","biz_common/dom/event.js","biz_wap/jsapi/core.js","pages/version4video.js","biz_common/utils/monitor.js"],function(t){
"use strict";
function e(t){
this._o={
wxIndex:0,
type:0,
src:"",
mid:"",
songId:"",
autoPlay:!1,
duration:0,
needVioceMutex:!0,
title:"",
allowPause:!1,
singer:"",
epname:"",
coverImgUrl:"",
webUrl:"",
fileSize:0,
onStatusChange:function(){},
onTimeupdate:function(){},
onError:function(){},
onUpdateSeekRange:function(){}
},this._extend(t),this._status=-1,this._g={
mutexKey:"",
hasCheckPlay:!1,
playTimeoutId:null,
stateChangeCallback:{}
},this._fixAndroidSizeLimit(),0!==b.surportType&&(this._initData(),this._synPlayStatus());
}
function o(t){
k.invoke("musicPlay",{
app_id:"a",
title:"微信公众平台",
singer:"微信公众平台",
epname:"微信公众平台",
coverImgUrl:"http://res.wx.qq.com/mpres/htmledition/images/favicon.ico",
dataUrl:b.ev,
lowbandUrl:b.ev,
webUrl:"http://mp.weixin.qq.com/s?"
},function(e){
"function"==typeof t&&t(e);
});
}
function i(t){
n({
cur:t,
stopCur:!1
});
}
function n(t){
function e(){
if(b.mutexCount==s&&(s=0,b.mutexCount=0,"function"==typeof a)){
var t=0;
1==b.surportType?t=2e3:3==b.surportType&&(t=0),setTimeout(function(){
a();
},t);
}
}
if(0!=b.mutexCount)return void setTimeout(function(){
n(t);
},200);
var o=t.cur,i=t.stopCur===!0?!0:!1,a=t.callback,s=0;
for(var r in b.mutexPlayers)for(var u=0,p=b.mutexPlayers[r].length;p>u;u++)s++;
for(var r in b.mutexPlayers)for(var u=0,p=b.mutexPlayers[r].length;p>u;u++){
var _=b.mutexPlayers[r][u];
if(_&&_!==o){
var c=_.getSurportType(),d="";
2!=c||1!=_._status&&4!=_._status?1!=c&&3!=c||1!=_._status&&2!=_._status&&4!=_._status||(d="stop"):d=_._o.allowPause?"pause":"stop",
d&&"function"==typeof _[d]?_[d](i,function(){
b.mutexCount++,e();
}):(b.mutexCount++,e());
}else b.mutexCount++,e();
}
}
function a(){
return b.surportType;
}
function s(t){
return new e(t);
}
function r(){
b.surportType>0&&b.isAndroidLow&&window.addEventListener("canplay",function(t){
t.target&&"function"==typeof t.target.play&&t.target.play();
},!0);
}
function u(){
b.jsapiGlobalEvent={
error:c,
pause:l,
stop:d,
play:h,
preempted:d,
waiting:y
};
}
function p(t){
return"&"+b.wxtag+"="+t;
}
function _(){
k.on("onBackgroundAudioStateChange",function(t){
if(!!b.debug&&console.log("onBackgroundAudioStateChange log:"+JSON.stringify(t||{})),
t.src&&t.state){
var e=T(b.wxtag,t.src)||"";
e&&(e=p(e));
var o=b.mutexPlayers[t.src]||b.mutexPlayers[e];
if(o){
var i;
if(1==o.length)i=o[0];else for(var n=0,a=o.length;a>n;n++)if(-1!=o[n]._status&&0!=o[n]._status&&3!=o[n]._status){
i=o[n];
break;
}
if(i&&i._g.stateChangeCallback){
var s=t.state;
"ended"==s&&(s="stop"),"wait"==s&&(s="waiting");
var r=!1;
if("error"==s)for(var u in i._g.stateChangeCallback)i._g.stateChangeCallback.hasOwnProperty(u)&&"function"==typeof i._g.stateChangeCallback[u]&&(r=!0,
i._g.stateChangeCallback[u](-1,t.errMsg||""),i._g.stateChangeCallback[u]=null);else"function"==typeof i._g.stateChangeCallback[s]&&(b.debug&&console.log("excute stateChangeCallback :"+s),
r=!0,i._g.stateChangeCallback[s](0),i._g.stateChangeCallback[s]=null);
r||"function"!=typeof b.jsapiGlobalEvent[s]||b.jsapiGlobalEvent[s](t,i);
}
}
}
});
}
function c(t,e){
e.stop(!1),v(e._o.type,"wx_err_2",1);
}
function d(t,e){
e.stop(!1);
}
function l(t,e){
e.pause(!1,null,!0);
}
function h(t,e){
1!=e._status&&e.resume(!1,null,!0);
}
function y(t,e){
e.onload();
}
function f(){
for(var t=b.reportId.split(";"),e=0,o=t.length;o>e;e++)for(var i=t[e],n=b.keyConf[e],a=0,s=0,r=n.length;r>s;s++){
var u=n[s]||"";
u?/^offset_/.test(u)?a+=1*u.replace(/^offset_/,""):(b.reportData[u]={
id:i,
key:a,
count:0
},a++):a++;
}
}
function m(){
for(var t in b.mutexPlayers)if(b.mutexPlayers.hasOwnProperty(t))for(var e=0,o=b.mutexPlayers[t].length;o>e;e++){
var i=b.mutexPlayers[t][e];
if(i&&1==i._status&&(1==i._surportType||3==i._surportType)){
v(i._o.type,"unload_wx_pv",1);
break;
}
}
g();
}
function g(){
for(var t in b.reportData){
var e=b.reportData[t];
e.count>0&&x.setSum(e.id,e.key,e.count);
}
x.send(),f();
}
function v(t,e,o){
0==t||1==t?e="m_"+e:(2==t||3==t||4==t)&&(e="v_"+e),b.reportData[e]&&(o=o||1,b.reportData[e].count+=o,
b.debug&&console.log("addpv:"+e+" count:"+b.reportData[e].count));
}
function T(t){
var e=arguments[1]||window.location.search,o=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),i=e.substr(e.indexOf("?")+1).match(o);
return null!=i?i[2]:"";
}
function S(t,e,o){
function i(t,e){
for(;b.synPlayStatusArr.length>0;){
var o=b.synPlayStatusArr.shift();
o&&"function"==typeof o[t]&&o[t](e);
}
}
b.synPlayStatusArr.push({
_t:t,
onSuccess:e,
onError:o
}),b.synPlayStatusId&&clearTimeout(b.synPlayStatusId),b.synPlayStatusId=setTimeout(function(){
t._jsapi_getMusicPlayerState({
onSuccess:function(t){
i("onSuccess",t);
},
onError:function(t){
i("onError",t);
}
});
},0);
}
document.domain="qq.com";
var P=t("biz_wap/utils/mmversion.js"),A=t("biz_common/dom/event.js"),k=t("biz_wap/jsapi/core.js"),w=t("pages/version4video.js"),x=t("biz_common/utils/monitor.js"),b={
synPlayStatusId:null,
synPlayStatusArr:[],
inWechat:!w.device.inWechat||w.device.inWindowWechat||w.device.inMacWechat?!1:!0,
mutexCount:0,
ev:0!=window._empty_v.indexOf(window.location.protocol)?"http:"+window._empty_v:window._empty_v,
debug:location.href.indexOf("vconsole=1")>0||document.cookie&&document.cookie.indexOf("vconsole_open=1")>-1?!0:!1,
_playtype:1*T("_playtype")||0,
isAndroidLow:/android\s2\.3/i.test(navigator.userAgent),
isAndroid:P.isAndroid,
surportType:"addEventListener"in window?2:0,
mutexPlayers:{},
reportId:"28306",
wxtag:"__wxtag__",
keyConf:[["m_pv","m_wx_pv","m_h5_pv","m_unload_wx_pv","v_pv","v_wx_pv","v_h5_pv","v_unload_wx_pv","offset_22","force_h5","m_h5_err_total","m_h5_err_1","m_h5_err_2","m_h5_err_3","m_h5_err_4","m_h5_err_5","v_h5_err_total","v_h5_err_1","v_h5_err_2","v_h5_err_3","v_h5_err_4","v_h5_err_5","m_wx_pv_2","v_wx_pv_2","offset_5","m_wx_pv_1","offset_4","v_wx_pv_1","offset_2","m_wx_err_1","m_wx_err_2","v_wx_err_1","v_wx_err_2"]],
reportData:{}
};
return f(),u(),_(),A.on(window,"unload",m),r(),e.prototype._synPlayStatus=function(){
function t(t){
if(a&&clearTimeout(a),n.hasCheckPlay!==!0&&(n.hasCheckPlay=!0,o._surportType=3,b.surportType=3,
!!b.debug&&console.log("_synPlayStatus mutexKey:"+n.mutexKey),t.src&&(i.src==t.src||t.src.indexOf(n.mutexKey)>0))){
if(b.mutexPlayers[n.mutexKey].length>1&&b.mutexPlayers[n.mutexKey][0]!==o)return;
o._initJsapiData({
curTime:t.currentTime,
bufferedPercent:t.bufferedPercent,
starTime:+new Date-1e3*t.currentTime
});
var e=o.jsApiData;
t.paused?(e.pauseTime=e.starTime+1e3*e.curTime,o._onPause(),o._onTimeupdate(null,e.curTime)):(o._onPlay(),
o._analogUpdateTime()),o._getMusicPlayerState();
}
}
function e(){
a&&clearTimeout(a),n.hasCheckPlay!==!0&&(n.hasCheckPlay=!0,o._o.autoPlay&&o.play());
}
var o=this,i=this._o,n=this._g;
if(!b.inWechat||1*b._playtype>0)return n.hasCheckPlay=!0,void(o._o.autoPlay&&o.play());
var a;
S(o,t,e),a=setTimeout(function(){
e();
},5e3);
},e.prototype._fixAndroidSizeLimit=function(){
if(!(1*b._playtype>0)&&b.isAndroid){
var t=this._o;
!t.fileSize||t.fileSize>300||P.gtVersion("6.3.28",!0)||(v(-1,"force_h5",1),this._g._playtype=2);
}
},e.prototype._createAutoAndPlay=function(){
function t(){
v(e._o.type,"pv",1),v(e._o.type,"h5_pv",1),e._h5Audio=document.createElement("audio"),
e._H5bindEvent(),e._h5Audio.setAttribute("style","height:0;width:0;display:none"),
e._h5Audio.setAttribute("autoplay",""),e._status=0,e._initH5Data(),b.isAndroidLow?(e._h5Audio.src=e._o.src,
document.body.appendChild(e._h5Audio),e._h5Audio.load()):(document.body.appendChild(e._h5Audio),
setTimeout(function(){
e._h5Audio.src=e._o.src,e._h5Audio.play();
},0)),e._surportType=2;
}
var e=this;
b.inWechat?this._stopJsapiPlay(!0,function(){
t();
}):t();
},e.prototype._destoryH5Audio=function(){
this._h5Audio&&(-1!=this._status&&"function"==typeof this._h5Audio.pause&&this._h5Audio.pause(),
document.body.removeChild(this._h5Audio),this._h5Audio=null,this._status=-1);
},e.prototype._onLoading=function(t){
this._status=4;
try{
i(this);
}catch(t){}
"function"==typeof this._o.onStatusChange&&this._o.onStatusChange.call(this,t||{},this._status);
},e.prototype._onPlay=function(t){
this._status=1;
try{
i(this);
}catch(t){}
"function"==typeof this._o.onStatusChange&&this._o.onStatusChange.call(this,t||{},this._status);
},e.prototype._onPause=function(t){
this._status=2,"function"==typeof this._o.onStatusChange&&this._o.onStatusChange.call(this,t||{},this._status);
},e.prototype._onEnd=function(t){
this._status=3,"function"==typeof this._o.onStatusChange&&this._o.onStatusChange.call(this,t||{},this._status);
},e.prototype._onLoadedmetadata=function(t){
"function"==typeof this._o.onLoadedmetadata&&this._o.onLoadedmetadata.call(this,t||{});
},e.prototype._onUpdateSeekRange=function(t){
this.surportSeekRange()&&(t=Math.max(t,0),t=Math.min(t,100),"function"==typeof this._o.onUpdateSeekRange&&this._o.onUpdateSeekRange.call(this,t));
},e.prototype._onTimeupdate=function(t,e){
"function"==typeof this._o.onTimeupdate&&this._o.onTimeupdate.call(this,t||{},e);
},e.prototype._onError=function(t,e){
this._status=-1,"function"==typeof this._o.onError&&this._o.onError.call(this,t||{},e);
},e.prototype._H5bindEvent=function(){
var t=this,e=this._o;
this._h5Audio.addEventListener("play",function(e){
t._h5Audio&&(t._onPlay(e),t._onUpdateSeekRange(t._h5Data.downloadDuration||0));
},!1),this._h5Audio.addEventListener("ended",function(e){
t._h5Audio&&(t._onUpdateSeekRange(t._h5Data.downloadDuration),t._onEnd(e));
},!1),this._h5Audio.addEventListener("pause",function(e){
t._h5Audio&&(t._o.allowPause!==!0||0==t._h5Audio.currentTime?t._onEnd(e):t._onPause(e));
},!1),this._h5Audio.addEventListener("error",function(e){
var o=1*e.target.error.code||5;
(1>o||o>5)&&(o=5),v(t._o.type,"h5_err_total",1),v(t._o.type,"h5_err_"+o,1),t._onError(e,o),
t._destoryH5Audio();
},!1),"function"==typeof this._o.onTimeupdate&&this._h5Audio.addEventListener("timeupdate",function(o){
t._h5Audio&&((1==t._status||4==t._status)&&t._onUpdateSeekRange(t._getH5DownloadDuration()),
1==t._status&&t._onTimeupdate(o,t._h5Audio.currentTime),"undefined"!=typeof e.duration&&1*e.duration>0&&t._h5Audio.currentTime>=e.duration&&t._h5Stop());
},!1),"function"==typeof this._o.onLoadedmetadata&&this._h5Audio.addEventListener("loadedmetadata",function(e){
t._h5Audio&&t._onLoadedmetadata(e);
},!1);
},e.prototype._initData=function(){
this._createMutexKey(),b.mutexPlayers[this._g.mutexKey]?b.mutexPlayers[this._g.mutexKey].push(this):b.mutexPlayers[this._g.mutexKey]=[this];
},e.prototype._createMutexKey=function(){
var t=this._o.mid||"";
this._g.mutexKey=this._o.src?this._o.src:p(t);
},e.prototype._extend=function(t){
for(var e in t)this._o[e]=t[e];
},e.prototype._initH5Data=function(){
this._h5Data={
downloadDuration:0
};
},e.prototype._initJsapiData=function(t){
t=t||{},this.jsApiData&&(this.jsApiData.updateTimeoutId&&clearTimeout(this.jsApiData.updateTimeoutId),
this.jsApiData.getStatusId&&clearTimeout(this.jsApiData.getStatusId)),this.jsApiData={
getStatusId:null,
getStatusTime:t.getStatusTime||2500,
updateTimeoutId:null,
seeking:!1,
starTime:t.starTime||+new Date,
curTime:t.curTime||0,
pauseTime:t.pauseTime||0,
bufferedPercent:t.bufferedPercent||0,
duration:this._o.duration||void 0
};
},e.prototype._getMusicPlayerState=function(){
var t=this,e=t._o,o=t.jsApiData;
o&&o.getStatusId&&clearTimeout(o.getStatusId),t._jsapi_getMusicPlayerState({
onSuccess:function(i){
i.src==e.src&&(o.curTime=i.currentTime,o.starTime=+new Date-1e3*i.currentTime,o.bufferedPercent=i.bufferedPercent,
(1==t._status||2==t._status)&&(o.getStatusId=setTimeout(function(){
t._getMusicPlayerState();
},o.getStatusTime)),t._onUpdateSeekRange(o.bufferedPercent),1==i.paused&&1==t._status?(b.debug&&console.log("_getMusicPlayerState force syn"),
t._pauseJsapiPlay(!1)):0==i.paused&&2==t._status&&(b.debug&&console.log("_getMusicPlayerState force syn"),
t._resumeJsapiPlay(!1)));
},
onError:function(){
o.getStatusId=setTimeout(function(){
t._getMusicPlayerState();
},o.getStatusTime);
}
});
},e.prototype._analogUpdateTime=function(){
var t=this,e=t.jsApiData;
if(e&&e.updateTimeoutId&&clearTimeout(e.updateTimeoutId),1==t._status){
if(e.curTime=1*((+new Date-e.starTime)/1e3).toFixed(2),e.curTime>=e.duration)return t._stopJsapiPlay(!1),
!0;
t._onTimeupdate(null,e.curTime);
}
return e.updateTimeoutId=setTimeout(function(){
t._analogUpdateTime();
},1e3),!1;
},e.prototype._jsapi_getMusicPlayerState=function(t){
var e=this._o;
k.invoke("getBackgroundAudioState",{},function(o){
if(!!b.debug&&console.log("getBackgroundAudioState log:"+JSON.stringify(o||{})),
/:ok$/.test(o.err_msg)){
if(o.paused=1*o.paused,o.currentTime=o.currentTime?(1*o.currentTime).toFixed(2):0,
o.buffered){
var i=Math.floor(o.buffered/e.duration*100);
i=Math.max(i,0),i=Math.min(i,100),o.bufferedPercent=i;
}else o.bufferedPercent=0;
"function"==typeof t.onSuccess&&t.onSuccess(o);
}else"function"==typeof t.onError&&t.onError(o);
});
},e.prototype._jsapi_musicPlay=function(t){
if(this._h5Audio&&this._destoryH5Audio(),2==b._playtype)return void("function"==typeof t.onError&&t.onError({}));
var e=this,o=this._o;
k.invoke("musicPlay",{
app_id:"a",
title:o.title,
singer:o.singer,
epname:o.epname,
coverImgUrl:o.coverImgUrl,
dataUrl:o.src,
lowbandUrl:o.src,
webUrl:o.webUrl
},function(i){
!!b.debug&&console.log("playlog:"+JSON.stringify(i||{})),i.err_msg.indexOf("ok")>=0?(v(o.type,"pv",1),
v(o.type,"wx_pv",1),v(o.type,"wx_pv_1",1),e._surportType=1,b.surportType=1,e._initJsapiData(),
e._onPlay(),"undefined"!=typeof o.duration&&1*o.duration>0&&e._analogUpdateTime(),
e._onUpdateSeekRange(0),"function"==typeof t.onSuccess&&t.onSuccess(i)):"function"==typeof t.onError&&t.onError(i);
});
},e.prototype._jsapi_setBackgroundAudioState=function(t){
if(this._h5Audio&&this._destoryH5Audio(),1*b._playtype>0){
if("function"==typeof t.onError){
var e={};
e.err_code=1,t.onError(e);
}
}else{
var o=this,i=this._o,n=o._g;
k.invoke("setBackgroundAudioState",{
src:i.src,
lowbandUrl:i.src,
title:i.title,
epname:i.epname,
singer:i.singer,
coverImgUrl:i.coverImgUrl,
webUrl:i.webUrl
},function(e){
!!b.debug&&console.log("setBackgroundAudioState log:"+JSON.stringify(e||{})),e.err_msg.indexOf("ok")>=0?("function"==typeof t.onSuccess&&t.onSuccess("waiting"),
n.stateChangeCallback.play=function(e,o){
0==e&&"function"==typeof t.onSuccess?t.onSuccess("play"):0!=e&&"function"==typeof t.onError&&t.onError({
err_code:2,
err_msg:o||""
});
}):"function"==typeof t.onError&&(e=e||{},e.err_code=1,t.onError(e));
});
}
},e.prototype._jsapi_operateBackgroundAudio=function(t){
var e=this,o=(this._o,e._g),i=t.position||"";
k.invoke("operateBackgroundAudio",{
operationType:t.type,
currentTime:i
},function(e){
if(!!b.debug&&console.log("operateBackgroundAudio "+t.type+",position:"+i+", log:"+JSON.stringify(e||{})),
e.err_msg.indexOf("ok")>=0){
var n=t.type;
"seek"==n?(o.stateChangeCallback.seeking=function(e,o){
0==e&&"function"==typeof t.onSuccess?t.onSuccess("seeking"):0!=e&&"function"==typeof t.onError&&t.onError({
err_msg:o||""
});
},o.stateChangeCallback.seeked=function(e,o){
0==e&&"function"==typeof t.onSuccess?t.onSuccess("seeked"):0!=e&&"function"==typeof t.onError&&t.onError({
err_msg:o||""
});
}):o.stateChangeCallback[n]=function(e,o){
0==e&&"function"==typeof t.onSuccess?t.onSuccess():0!=e&&"function"==typeof t.onError&&t.onError({
err_msg:o||""
});
};
}else"function"==typeof t.onError&&t.onError(e);
});
},e.prototype._jsapiPlay=function(){
var t=this,e=this._o;
1==b.surportType?this._jsapi_musicPlay({
onError:function(){
t._h5Play();
}
}):this._jsapi_setBackgroundAudioState({
onSuccess:function(o){
"waiting"===o?(v(e.type,"pv",1),v(e.type,"wx_pv",1),v(e.type,"wx_pv_2",1),t._surportType=3,
b.surportType=3,t._onLoading()):"play"===o&&(t._initJsapiData(),t._onPlay(),"undefined"!=typeof e.duration&&1*e.duration>0&&(t._analogUpdateTime(),
t._getMusicPlayerState()));
},
onError:function(o){
o&&1==o.err_code?t._jsapi_musicPlay({
onError:function(){
t._h5Play();
}
}):(t._h5Play(),v(e.type,"wx_err_1",1));
}
});
},e.prototype._getJsapiDownloadSec=function(){
this._getMusicPlayerState();
var t=Math.floor(this._o.duration*this.jsApiData.bufferedPercent/100);
return!!b.debug&&console.log("downloadSec:"+t),t;
},e.prototype._jsapiSeek=function(t){
function e(){
n.seeking=!1,o._onPlay(),n.starTime=+new Date-1e3*a,o._analogUpdateTime(),o._getMusicPlayerState();
}
var o=this,i=this._g,n=this.jsApiData,a=parseInt(t,10);
n.getStatusId&&clearTimeout(n.getStatusId),n.updateTimeoutId&&clearTimeout(n.updateTimeoutId),
n.seekWaitId&&clearTimeout(n.seekWaitId),n.seeking=!0;
var s;
this._jsapi_operateBackgroundAudio({
type:"seek",
position:a,
onError:function(){
!!b.debug&&console.log("seek callback fail"),n.seeking=!1,o._analogUpdateTime(),
o._getMusicPlayerState();
},
onSuccess:function(t){
"seeking"==t?(!!b.debug&&console.log("seeking callback success"),n.seeking=!0,o._onLoading(),
i.stateChangeCallback.play=function(){
!!b.debug&&console.log("seeked to play"),s&&clearTimeout(s),e();
}):"seeked"==t&&(!!b.debug&&console.log("seeked callback success"),(2==o._status||4==o._status)&&(s=setTimeout(function(){
!!b.debug&&console.log("setTimeout to play"),i.stateChangeCallback.play=null,o._resumeJsapiPlay(!0);
},1e3)));
}
}),o._getMusicPlayerState();
},e.prototype._resumeJsapiPlay=function(t,e){
function o(t){
var e=i.jsApiData;
e.starTime+=+new Date-e.pauseTime,e.pauseTime=0,i._onPlay(),i._analogUpdateTime(),
i._getMusicPlayerState(),"function"==typeof t&&t();
}
var i=this;
1==this._surportType?this._jsapiPlay():3==this._surportType&&(t?this._jsapi_operateBackgroundAudio({
type:"play",
onError:function(){
i._stopJsapiPlay(!1,function(){
i.play();
});
},
onSuccess:function(){
o(e);
}
}):o(e));
},e.prototype._pauseJsapiPlay=function(t,e,o){
function i(t){
var e=n.jsApiData;
1==n._status&&(e.pauseTime=+new Date,n._onPause()),n._analogUpdateTime(),n._getMusicPlayerState(),
e&&e.updateTimeoutId&&clearTimeout(e.updateTimeoutId),e.updateTimeoutId=null,t===!0&&e&&e.getStatusId&&clearTimeout(e.getStatusId);
}
var n=this;
return 2==n._status?(i(e),void("function"==typeof o&&o())):void(1==this._surportType?this._stopJsapiPlay(t,o):3==this._surportType&&(t?this._jsapi_operateBackgroundAudio({
type:"pause",
onSuccess:function(){
i(e),"function"==typeof o&&o();
},
onError:function(){
n._stopJsapiPlay(!0,o);
}
}):(i(e),"function"==typeof o&&o())));
},e.prototype._stopJsapiPlay=function(t,e){
function i(t){
n._initJsapiData(),n._onTimeupdate(null,0),n._onUpdateSeekRange(0),n._onEnd(),"function"==typeof t&&t();
}
{
var n=this;
n.jsApiData;
}
t?1==n._surportType?o(function(){
i(e);
}):n._jsapi_operateBackgroundAudio({
type:"stop",
onSuccess:function(){
i(e);
},
onError:function(){
i(e);
}
}):i(e);
},e.prototype._getH5DownloadSec=function(){
var t=Math.floor(this._o.duration*this._getH5DownloadDuration()/100);
return!!b.debug&&console.log("h5 downloadSec:"+t),t;
},e.prototype._getH5DownloadDuration=function(){
if(!this._h5Audio)return 0;
if(this._h5Data.downloadDuration>=100)return 100;
var t=this._h5Audio.buffered,e=t.end(t.length-1);
return this._h5Data.downloadDuration=parseInt(e/this._o.duration*100,10),this._h5Data.downloadDuration;
},e.prototype._h5Play=function(){
0!==b.surportType&&(this._h5Audio?(this._h5Audio.ended||this._h5Audio.paused)&&(v(this._o.type,"pv",1),
v(this._o.type,"h5_pv",1),this._initH5Data(),this._h5Audio.currentTime=0,this._h5Audio.play()):this._createAutoAndPlay());
},e.prototype._h5Resume=function(){
this._h5Audio&&this._h5Audio.play();
},e.prototype._h5Stop=function(){
this._h5Audio&&(this._initH5Data(),this._h5Audio.pause(),this._h5Audio.currentTime=0,
this._onUpdateSeekRange(0),this._onEnd());
},e.prototype._h5Seek=function(t){
if(this._h5Audio){
{
var e=(this._h5Data,parseInt(t,10));
this._getH5DownloadSec();
}
e=Math.min(e,this._o.duration),this._h5Audio.currentTime=e,this._h5Audio.play();
}
},e.prototype.surportSeekRange=function(){
return 1==b._playtype?!1:2==this._surportType||3==this._surportType?!0:!1;
},e.prototype.setSrc=function(t){
-1==t.indexOf("?")&&(t+="?"),t+=p(this._o.mid),this._o.src=t,this._g.mutexKey=this._o.src,
b.mutexPlayers[this._g.mutexKey]?b.mutexPlayers[this._g.mutexKey].push(this):b.mutexPlayers[this._g.mutexKey]=[this];
},e.prototype.setDuration=function(t){
this._o.duration=t||0;
},e.prototype.getSurportType=function(){
return this._surportType||0;
},e.prototype.getPlayStatus=function(){
return this._status;
},e.prototype.getCurTime=function(){
return 1!=this._surportType&&3!=this._surportType||!this.jsApiData?this._h5Audio?this._h5Audio.currentTime:0:this.jsApiData.curTime||0;
},e.prototype.getDuration=function(){
return this._o.duration||void 0;
},e.prototype.pause=function(t,e,o){
return o===!0||this._o.allowPause?void(1==this._surportType||3==this._surportType?this._pauseJsapiPlay(t===!1?!1:!0,!1,function(){
"function"==typeof e&&e();
},function(){
"function"==typeof e&&e();
}):2==this._surportType&&this._h5Audio&&"function"==typeof this._h5Audio.pause&&(this._h5Audio.pause(),
"function"==typeof e&&e())):void this.stop(t,e);
},e.prototype.stop=function(t,e){
return 1==this._surportType||3==this._surportType?void this._stopJsapiPlay(t===!1?!1:!0,e):(2==this._surportType&&this._h5Audio&&this._h5Stop(),
void("function"==typeof e&&e()));
},e.prototype.resume=function(t,e,o){
(o===!0||2==this._status&&this._o.allowPause)&&(b.inWechat&&2!=b._playtype?this._resumeJsapiPlay(t===!1?!1:!0):0!=b.surportType&&this._h5Resume());
},e.prototype.onload=function(){
this._onLoading();
},e.prototype.play=function(){
var t=this,e=this._g;
if(t._o.src)return 2==t._status&&t._o.allowPause?void t.resume():(e.playTimeoutId&&clearTimeout(e.playTimeoutId),
e.hasCheckPlay?void(b.inWechat?this._jsapiPlay():0!=b.surportType&&this._h5Play()):void(e.playTimeoutId=setTimeout(function(){
t.play();
},1e3)));
},e.prototype.seek=function(t){
{
var e=this;
this._g;
}
if(1==e._status||2==e._status)return 3==this._surportType?void this._jsapiSeek(t):2==this._surportType&&this._h5Audio?void this._h5Seek(t):void 0;
},e.prototype.monitor=function(t,e){
v(-1,t,e);
},{
init:s,
getSurportType:a
};
});define("pages/voice_tpl.html.js",[],function(){
return'<div>\n    <#if(show_not_support===true){#>\n    <p>当前浏览器不支持播放音乐或语音，请在微信或其他浏览器中播放</p>\n    <#}#>\n    <div aria-labelledby="语音" id="voice_main_<#=voiceid#>_<#=posIndex#>" class="share_audio_context flex_context" <#if(!musicSupport){#>style="display:none;"<#}#>>\n        <div id="voice_play_<#=voiceid#>_<#=posIndex#>" aria-labelledby="播放开关" class="share_audio_switch"><em class="icon_share_audio_switch" role="button"></em></div>\n        <div id="voice_detail_<#=voiceid#>_<#=posIndex#>" class="share_audio_info flex_bd">\n            <strong class="share_audio_title" aria-describedby="语音标题" role="link"><#=title#></strong>\n            <#if(!!nickname){#>\n            <p class="share_audio_tips">来自<#=nickname#></p>\n            <#}#>\n            <div id="voice_seekRange_<#=voiceid#>_<#=posIndex#>" class="share_audio_progress_wrp">\n                <div class="share_audio_progress">\n                    <div id="voice_progress_<#=voiceid#>_<#=posIndex#>" style="width:0%" class="share_audio_progress_inner"></div>\n                    <div id="voice_buffer_<#=voiceid#>_<#=posIndex#>" class="share_audio_progress_buffer" style="width:0%;"></div>\n                    <div id="voice_loading_<#=voiceid#>_<#=posIndex#>" class="share_audio_progress_loading" style="display:none;">\n                        <div class="share_audio_progress_loading_inner"></div>\n                    </div>\n                </div>\n                <span id="voice_playdot_<#=voiceid#>_<#=posIndex#>" class="share_audio_progress_handle" style="display:none;left:0%;"></span>\n            </div>\n            <div class="share_audio_desc" aria-labelledby="时长">\n                <em id="voice_playtime_<#=voiceid#>_<#=posIndex#>" class="share_audio_length_current" aria-hidden="true">00:00</em>\n                <em class="share_audio_length_total"><#=duration_str#></em>\n            </div>\n        </div>\n    </div>\n</div>\n';
});define("pages/voice_component.js",["biz_common/dom/event.js","biz_common/tmpl.js","pages/loadscript.js","pages/music_player.js","biz_common/dom/class.js","pages/report.js","biz_common/utils/monitor.js"],function(e,t,r,o){
"use strict";
function a(e){
this._o={
wxIndex:0,
type:0,
comment_id:"",
src:"",
mid:"",
songId:"",
autoPlay:!1,
duration:0,
debug:!1,
needVioceMutex:!0,
appPlay:!0,
title:"",
allowPause:!1,
singer:"",
epname:"",
coverImgUrl:"",
webUrl:[location.protocol,"//mp.weixin.qq.com/s?referFrom=#referFrom#&songid=#songId#&__biz=",window.biz,"&mid=",window.mid,"&idx=",window.idx,"&sn=",window.sn,"#wechat_redirect"].join(""),
playingCss:"",
playCssDom:"",
playArea:"",
progress:"",
detailUrl:"",
detailArea:"",
fileSize:0,
playtimeDom:"",
loadingDom:"",
bufferDom:"",
playdotDom:"",
seekRange:"",
seekContainer:""
},this._init(e);
}
function i(e,t,r,o){
b.num++,t.musicSupport=b.musicSupport,t.show_not_support=!1,b.musicSupport||1!=b.num||(t.show_not_support=!0);
var a=document.createElement("div"),i="";
if(i=_.tmpl(e,t),a.innerHTML=i,o===!0)r.appendChild(a.children[0]);else{
var n=r.parentNode;
if(!n)return;
n.lastChild===r?n.appendChild(a.children[0]):n.insertBefore(a.children[0],r.nextSibling);
}
}
function n(){
"undefined"==typeof window.reportVoiceid&&(window.reportVoiceid=[]),"undefined"==typeof window.reportMid&&(window.reportMid=[]);
}
function s(){
y.on(window,"unload",p);
}
function p(){
function e(e,t){
for(var r=0,o=e.length;o>r;r++)e[r]=t;
return e;
}
for(var t in b.reportData)v.musicreport({
data:b.reportData[t]
}),b.reportData[t].hasended=e(b.reportData[t].hasended,0),b.reportData[t].detail_click=e(b.reportData[t].detail_click,0),
b.reportData[t].errorcode=e(b.reportData[t].errorcode,0),b.reportData[t].play_duration=e(b.reportData[t].play_duration,0);
}
function c(e){
k.setSum(b.reportId,18,1),k.send();
var t=+new Date,r="//open.music.qq.com/fcgi-bin/fcg_music_get_song_info_weixin.fcg?song_id=#songid#&mid=#mid#&format=json&app_id=1034002693&app_key=cjjDaueOyPYRJFeTqG&device_id=weixin&file_type=mp3&qqmusic_fromtag=50&callback=get_song_info_back";
r=r.replace("#mid#",e.mid).replace("#songid#",e.id),h({
url:r,
timeout:3e4,
callbackName:"get_song_info_back",
callback:function(r){
var o=+new Date-t;
if(!r||"undefined"==typeof r.ret){
var a=1;
return d({
type:"error",
time:o,
code:a
}),void("function"==typeof e.onError&&e.onError({
errcode:a
}));
}
var i;
i=0==r.ret?r.play_url?0:6:1001==r.ret?1:1002==r.ret?2:1003==r.ret?3:1004==r.ret?4:5,
d({
type:"success",
time:o,
code:i
}),e.onSuc({
status:i,
play_url:r.play_url,
duration:r.song_play_time||0
});
},
onerror:function(r){
var o=+new Date-t,a=4;
switch(1*r){
case 400:
a=2;
break;

case 500:
a=3;
break;

default:
a=4;
}
d({
type:"error",
time:o,
code:a
}),"function"==typeof e.onError&&e.onError({
errcode:a
});
}
});
}
function d(e){
var t=Math.max(e.time,0);
if(t=Math.min(t,6e4),e.time>=0&&e.time<200?k.setSum(b.reportId,24,1):e.time>=200&&e.time<500?k.setSum(b.reportId,25,1):e.time>=500&&e.time<1e3?k.setSum(b.reportId,26,1):e.time>=1e3&&e.time<2e3?k.setSum(b.reportId,27,1):e.time>=2e3&&e.time<1e4?k.setSum(b.reportId,28,1):e.time>=1e4&&k.setSum(b.reportId,29,1),
k.setAvg(b.reportId,23,t),"error"==e.type){
switch(1*e.code){
case 1:
k.setSum(b.reportId,9,1);
break;

case 2:
k.setSum(b.reportId,10,1);
break;

case 3:
k.setSum(b.reportId,11,1);
break;

case 4:
k.setSum(b.reportId,12,1);
}
k.setSum(b.reportId,19,1);
}else if("success"==e.type){
switch(1*e.code){
case 1:
k.setSum(b.reportId,8,1);
break;

case 0:
k.setSum(b.reportId,17,1);
break;

case 2:
k.setSum(b.reportId,13,1);
break;

case 3:
k.setSum(b.reportId,14,1);
break;

case 4:
k.setSum(b.reportId,15,1);
break;

case 5:
k.setSum(b.reportId,16,1);
break;

case 6:
k.setSum(b.reportId,47,1);
}
k.setSum(b.reportId,20,1);
}
k.send();
}
function u(e){
return new a(e);
}
function l(e){
if(isNaN(e))return"00:00";
e=Math.ceil(e);
var t=Math.floor(e/3600),r=Math.floor((e-3600*t)/60),o=e-3600*t-60*r;
return 0!=t?(10>t&&(t="0"+t),t+=":"):t="",10>r&&(r="0"+r),10>o&&(o="0"+o),t+r+":"+o;
}
function m(e){
return e=(e||"").replace(/&#96;/g,"`").replace(/&#61;/g,"=").replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");
}
function g(e){
return e=(e||"").replace(/&/g,"&amp;").replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/=/g,"&#61;").replace(/`/g,"&#96;");
}
var y=e("biz_common/dom/event.js"),_=e("biz_common/tmpl.js"),h=e("pages/loadscript.js"),f=e("pages/music_player.js"),D=e("biz_common/dom/class.js"),v=e("pages/report.js"),k=e("biz_common/utils/monitor.js"),b={
reportId:"28306",
musicSupport:f.getSurportType(),
debug:location.href.indexOf("vconsole=1")>0||document.cookie&&document.cookie.indexOf("vconsole_open=1")>-1?!0:!1,
reportData:{},
posIndex:{},
qqMusiceSongId:"http://thirdparty.gtimg.com/#songId#.m4a?fromtag=38&songid=#songId#",
qqMusiceMid:"http://thirdparty.gtimg.com/C100#mid#.m4a?fromtag=38&songid=#songId#",
num:0
};
return n(),s(),a.prototype._init=function(e){
this._extend(e),this._g={
copyright:-1,
check_copyright:!1,
canDragBar:!1,
barDraging:!1,
canGoDetail:!0
},this._initQQmusicLyric(),this._initReportData(),this._initPlayer(),this._playEvent();
},a.prototype._initQQmusicLyric=function(){
var e=this._o;
e.webUrl=0==e.type||1==e.type?e.webUrl.replace("#songId#",e.songId||"").replace("#referFrom#","music.qq.com"):e.webUrl.replace("#songId#","").replace("#referFrom#","");
},a.prototype._initReportData=function(){
var e=this._o;
2==e.type||3==e.type||4==e.type?window.reportVoiceid.push(e.songId):(0==e.type||1==e.type)&&window.reportMid.push(e.songId),
"undefined"==typeof b.reportData[e.type]&&(b.reportData[e.type]=v.getMusicReportData(e),
b.posIndex[e.type]=0),this._g.posIndex=b.posIndex[e.type]++;
var t=b.reportData[e.type];
t.musicid.push(e.songId),t.commentid.push(e.comment_id),t.hasended.push(0),t.mtitle.push(e.title),
t.detail_click.push(0),t.duration.push(parseInt(1e3*e.duration)),t.errorcode.push(0),
t.play_duration.push(0);
},a.prototype._initPlayer=function(){
b.musicSupport&&(this._o.onStatusChange=this._statusChangeCallBack(),this._o.onTimeupdate=this._timeupdateCallBack(),
this._o.onError=this._errorCallBack(),this._o.onUpdateSeekRange=this._onUpdateSeekRange(),
this.player=new f.init(this._o));
},a.prototype.isInSeekrang=function(e){
var t=this._o.seekRange;
if(!t)return!1;
if(t===e)return!0;
for(var r=t.getElementsByTagName("*"),o=0,a=r.length;a>o;o++)if(r[o]===e)return!0;
return!1;
},a.prototype._playEvent=function(){
var e=this,t=this._o,r=this._g;
if(t.detailUrl&&t.detailArea&&y.on(t.detailArea,"click",function(o){
if(!r.barDraging&&r.canGoDetail){
var a=o.target||o.srcElement;
a&&e.isInSeekrang(a)||(2==t.type||3==t.type||4==t.type?(b.reportData[t.type].detail_click[r.posIndex]=1,
window.location.href=t.detailUrl):(0==t.type||1==t.type)&&e._checkCopyright(function(){
b.reportData[t.type].detail_click[r.posIndex]=1,window.location.href=t.detailUrl;
}));
}
}),b.musicSupport){
var o=0,a=4,i=5;
2==t.type?o=3:3==t.type?o=6:4==t.type?o=7:(0==t.type||1==t.type)&&(o=1),y.tap(t.playArea,function(){
return D.hasClass(t.playCssDom,t.playingCss)?(t.allowPause?e.player.pause():e.player.stop(),
v.report({
type:o,
comment_id:t.comment_id,
voiceid:t.songId,
action:i
})):1==o?e._checkCopyright(function(){
e.player.setSrc(r.play_url),r.duration&&e.player.setDuration(r.duration),e._playMusic(o,a);
}):e._playMusic(o,a),!1;
}),e._dragEvent();
}
},a.prototype._dragEvent=function(){
var e=this,t=this._o,r=this._g,o=t.seekRange;
if(o){
for(var a=0,i=o;i&&i!=document.body;)a+=i.offsetLeft,i=i.offsetParent;
var n=e.player.getDuration();
r.seekData={
offsetLeft:a,
duration:n,
rangeWidth:o.offsetWidth,
startTime:0,
dragTime:0,
downX:0,
moveX:0
},y.on(o,"mousedown",function(t){
r.canDragBar&&(e._pointerDownHandler({
x:t.pageX||t.clientX
}),t.preventDefault());
}),y.on(t.seekContainer,"mousemove",function(t){
r.canDragBar&&r.barDraging&&(e._pointerMoveHandler({
x:t.pageX||t.clientX
}),t.preventDefault(),t.stopPropagation());
}),y.on(document.body,"mouseup",function(t){
return r.canDragBar&&r.barDraging?(e._pointerUpHandler({
x:t.pageX||t.clientX
}),t.preventDefault(),t.stopPropagation(),!1):void 0;
}),y.on(o,"touchstart",function(t){
r.canDragBar&&(e._pointerDownHandler({
x:t.changedTouches[0].clientX
}),t.preventDefault());
}),y.on(o,"touchmove",function(t){
r.canDragBar&&r.barDraging&&(e._pointerMoveHandler({
x:t.changedTouches[0].clientX
}),t.preventDefault(),t.stopPropagation());
}),y.on(o,"touchend",function(t){
return r.canDragBar&&r.barDraging?(e._pointerUpHandler({
x:t.changedTouches[0].clientX
}),t.preventDefault(),t.stopPropagation(),!1):void 0;
});
}
},a.prototype._pointerDownHandler=function(e){
var t=this._g;
t.barDraging=!0,t.canGoDetail=!1,t.seekData.downX=e.x,t.seekData.startTime=this.player.getCurTime();
},a.prototype._pointerMoveHandler=function(e){
var t=this._g,r=t.seekData;
r.moveX=e.x;
var o=(r.moveX-r.offsetLeft)/r.rangeWidth;
o=Math.min(o,1),o=Math.max(o,0),r.dragTime=o*r.duration,r.dragTime!=r.startTime&&this._updateProgressBar(r.dragTime);
},a.prototype._pointerUpHandler=function(e){
var t=this._g,r=t.seekData;
r.dragTime||this._pointerMoveHandler({
x:e.x
}),t.barDraging=!1,this.player.seek(r.dragTime),t.seekData.startTime=0,t.seekData.dragTime=0,
t.seekData.downX=0,t.seekData.moveX=0,setTimeout(function(){
t.canGoDetail=!0;
},1e3);
},a.prototype._checkCopyright=function(e){
var t=this,r=this._o,o=this._g;
return o.play_url&&this._musicCopyrightWarnning(!1)===!1?void("function"==typeof e&&e()):void(o.check_copyright||(o.check_copyright=!0,
c({
id:r.songId,
mid:r.mid,
onSuc:function(r){
o.check_copyright=!1,o.copyright=1*r.status,t._musicCopyrightWarnning(!0)===!1&&"function"==typeof e&&(o.play_url=r.play_url,
o.duration=r.duration||0,e({
play_url:r.play_url,
duration:o.duration
}));
},
onError:function(){
o.check_copyright=!1;
}
})));
},a.prototype._musicCopyrightWarnning=function(e){
var t=this._g,r=!0,a="";
switch(1*t.copyright){
case 0:
r=!1;
break;

case 1:
r=!0,a="该歌曲版权已过期，无法播放。";
break;

case 2:
r=!0,a="抱歉，应版权方要求，当前国家或地区暂不提供此歌曲服务。";
break;

case 3:
r=!0,a="该歌曲版权已过期，无法播放。";
break;

case 4:
r=!0,a="抱歉，歌曲信息不正确。";
break;

case 5:
r=!0,a="系统错误，请稍后再试。";
break;

case 6:
r=!0,a="系统错误，请稍后再试。";
break;

default:
r=!0,a="系统错误，请稍后再试。";
}
return r===!0&&e===!0&&(a+="错误码："+t.copyright,setTimeout(function(){
o(a);
},0)),r;
},a.prototype._playMusic=function(e,t){
var r=this._o,o=this._g;
this.player.play(),b.reportData[r.type].hasended[o.posIndex]=1,v.report({
type:e,
comment_id:r.comment_id,
voiceid:r.songId,
action:t
});
},a.prototype._extend=function(e){
for(var t in e)this._o[t]=e[t];
},a.prototype._onUpdateSeekRange=function(){
var e=this,t=e._o,r=e._g;
return function(e){
this.surportSeekRange()&&t.bufferDom&&t.playdotDom?(r.canDragBar=!0,t.playdotDom.style.display="block",
t.bufferDom.style.width=1*e+"%"):(r.canDragBar=!1,t.playdotDom&&(t.playdotDom.style.display="none"));
};
},a.prototype._statusChangeCallBack=function(){
var e=this;
return function(t,r){
e._updatePlayerCss(this,r);
};
},a.prototype._timeupdateCallBack=function(){
var e=this,t=this._o,r=this._g;
return function(o,a){
e._updateProgress(a),0!=a&&(b.reportData[t.type].play_duration[r.posIndex]=parseInt(1e3*a));
};
},a.prototype._errorCallBack=function(){
var e=this,t=this._o,r=this._g;
return function(o,a){
b.reportData[t.type].errorcode[r.posIndex]=a,e._updatePlayerCss(this,3);
};
},a.prototype._updatePlayerCss=function(e,t){
!!b.debug&&console.log("status:"+t);
{
var r=this._o,o=r.playCssDom;
r.progress;
}
2==t?(D.removeClass(o,r.playingCss),r.playdotDom&&(e.surportSeekRange()?(r.playdotDom.style.display="block",
this._g.canDragBar=!0):(r.playdotDom.style.display="none",this._g.canDragBar=!1))):3==t?(D.removeClass(o,r.playingCss),
r.playdotDom&&(r.playdotDom.style.display="none",this._g.canDragBar=!1),this._updateProgress(0)):(1==t||4==t)&&(D.addClass(o,r.playingCss),
r.playdotDom&&(e.surportSeekRange()?(r.playdotDom.style.display="block",this._g.canDragBar=!0):(r.playdotDom.style.display="none",
this._g.canDragBar=!1))),r.loadingDom&&(r.loadingDom.style.display=4==t?"block":"none");
},a.prototype._updateProgress=function(e){
this._g.barDraging||this._updateProgressBar(e);
},a.prototype._updateProgressBar=function(e){
var t=this._o,r=this.player,o=r.getDuration();
if(o){
var a=this._countProgress(o,e);
t.progress&&(t.progress.style.width=a),t.playtimeDom&&(t.playtimeDom.innerHTML=l(e)),
t.playdotDom&&(t.playdotDom.style.left=a);
}
},a.prototype._countProgress=function(e,t){
return Math.min(t/e*100,100)+"%";
},{
init:u,
renderPlayer:i,
formatTime:l,
decodeStr:m,
encodeStr:g
};
});define("appmsg/voice.js",["biz_common/utils/string/html.js","pages/voice_tpl.html.js","pages/voice_component.js"],function(e){
"use strict";
function i(){
var e=d("js_content");
return e?(r._oElements=e.getElementsByTagName("mpvoice")||[],r._oElements.length<=0?!1:!0):!1;
}
function o(){
r.musicLen=r._oElements.length;
}
function n(){
for(var e=0,i=0;i<r.musicLen;i++){
var o=r._oElements[i],n={},c=o.getAttribute("voice_encode_fileid")||"";
try{
c=decodeURIComponent(c);
}catch(d){}
n.voiceid=s.encodeStr(c),n.voiceid=n.voiceid.replace(/&#61;/g,"=").replace(/^\s/,"").replace(/\s$/,""),
n.src=r.srcRoot.replace("#meidaid#",n.voiceid),n.voiceid&&"undefined"!=n.voiceid&&(t(o,n,e),
e++);
}
}
function t(e,i,o){
i.duration=parseInt((1*e.getAttribute("play_length")||0)/1e3,10),i.duration_str=s.formatTime(i.duration),
i.posIndex=o;
var n=e.getAttribute("name")||"";
try{
n=decodeURIComponent(n);
}catch(t){}
i.title=s.encodeStr(n).replace(/^\s/,"").replace(/\s$/,""),i.fileSize=1*e.getAttribute("high_size")||0,
i.nickname=window.nickname,s.renderPlayer(a,i,e),c(i),r.musicList[i.voiceid+"_"+i.posIndex]=i;
}
function c(e){
var i=e.voiceid+"_"+e.posIndex,o="";
if(window.voice_in_appmsg&&window.voice_in_appmsg[e.voiceid]){
var n=window.voice_in_appmsg[e.voiceid],t=window.biz||"",c=window.mid||"",a=window.idx||"";
n.bizuin&&n.appmsgid&&n.idx&&(t=n.bizuin,c=n.appmsgid,a=n.idx),o="https://mp.weixin.qq.com/mp/audio?_wxindex_=#_wxindex_#&scene=104&__biz=#biz#&mid=#mid#&idx=#idx#&voice_id=#voice_id#&sn=#sn##wechat_redirect".replace("#_wxindex_#",e.posIndex).replace("#biz#",t).replace("#mid#",c).replace("#idx#",a).replace("#voice_id#",e.voiceid).replace("#sn#",n.sn||"");
}
var r=s.decodeStr(e.title);
e.player=s.init({
wxIndex:e.posIndex,
type:2,
songId:e.voiceid,
comment_id:"",
src:e.src,
allowPause:!0,
duration:e.duration,
title:r,
singer:window.nickname?window.nickname+"的语音":"公众号语音",
epname:"来自文章",
coverImgUrl:window.__appmsgCgiData.hd_head_img,
playingCss:"share_audio_playing",
playCssDom:d("voice_main_"+i),
playArea:d("voice_play_"+i),
progress:d("voice_progress_"+i),
fileSize:e.fileSize,
playtimeDom:d("voice_playtime_"+i),
bufferDom:d("voice_buffer_"+i),
playdotDom:d("voice_playdot_"+i),
seekRange:d("voice_seekRange_"+i),
seekContainer:d("voice_main_"+i),
loadingDom:d("voice_loading_"+i),
detailArea:o?d("voice_detail_"+i):"",
detailUrl:o
});
}
function d(e){
return document.getElementById(e);
}
e("biz_common/utils/string/html.js");
var a=e("pages/voice_tpl.html.js"),s=e("pages/voice_component.js"),r={
musicList:{},
musicLen:0,
srcRoot:location.protocol+"//res.wx.qq.com/voice/getvoice?mediaid=#meidaid#"
};
return i()?(o(),n(),r.musicList):void 0;
});define("appmsg/qqmusic.js",["biz_common/utils/string/html.js","pages/qqmusic_tpl.html.js","pages/voice_component.js"],function(e){
"use strict";
function i(){
var e=c("js_content");
return e?(a._oElements=e.getElementsByTagName("qqmusic")||[],a._oElements.length<=0?!1:!0):!1;
}
function t(){
a.musicLen=a._oElements.length;
}
function m(){
for(var e=0,i=0;i<a.musicLen;i++){
var t=a._oElements[i],m={};
m.musicid=o.encodeStr(t.getAttribute("musicid")||"").replace(/^\s/,"").replace(/\s$/,""),
m.comment_id=o.encodeStr(t.getAttribute("commentid")||"").replace(/^\s/,"").replace(/\s$/,""),
m.musicid&&"undefined"!=m.musicid&&m.comment_id&&"undefined"!=m.comment_id&&(n(t,m,e),
e++);
}
}
function n(e,i,t){
i.media_id=o.encodeStr(e.getAttribute("mid")||"").replace(/^\s/,"").replace(/\s$/,""),
i.duration=parseInt((e.getAttribute("play_length")||0)/1e3,10),i.posIndex=t,i.musicImgPart=o.encodeStr(e.getAttribute("albumurl")||"").replace(/^\s/,"").replace(/\s$/,"");
var m="";
m=i.musicImgPart.split("/");
try{
m=m[m.length-1],m=m.split(".")[0];
}catch(n){
m="";
}
i.music_img=m?a.imgroot2.replace("#mid#",m):a.imgroot+i.musicImgPart,i.audiourl=o.encodeStr(e.getAttribute("audiourl")||"").replace(/^\s/,"").replace(/\s$/,""),
i.singer=o.encodeStr(e.getAttribute("singer")||"").replace(/^\s/,"").replace(/\s$/,""),
i.music_name=o.encodeStr(e.getAttribute("music_name")||"").replace(/^\s/,"").replace(/\s$/,""),
o.renderPlayer(r,i,e),s(i),a.musicList[i.musicid+"_"+i.posIndex]=i;
}
function s(e){
var i=e.musicid+"_"+e.posIndex,t=e.comment_id+"_"+e.posIndex,m=["http://i.y.qq.com/v8/playsong.html?songmid=",e.media_id,,"&ADTAG=weixin_gzh#wechat_redirect"].join(""),n=o.decodeStr(e.music_name);
e.player=o.init({
wxIndex:e.posIndex,
type:0,
comment_id:e.comment_id,
mid:e.media_id,
songId:e.musicid,
duration:e.duration,
title:n,
singer:window.nickname?window.nickname+"推荐的歌":"公众号推荐的歌",
epname:"QQ音乐",
coverImgUrl:e.music_img,
playingCss:"qqmusic_playing",
playCssDom:c("qqmusic_main_"+t),
playArea:c("qqmusic_play_"+i),
detailUrl:m,
detailArea:c("qqmusic_home_"+i)
});
}
function c(e){
return document.getElementById(e);
}
e("biz_common/utils/string/html.js");
var r=e("pages/qqmusic_tpl.html.js"),o=e("pages/voice_component.js"),a={
imgroot:"https://imgcache.qq.com/music/photo/mid_album_68",
imgroot2:"https://y.gtimg.cn/music/photo_new/T002R68x68M000#mid#.jpg",
musicList:{},
musicLen:0
};
return i()?(t(),m(),a.musicList):void 0;
});;define('page/appmsg/page_mp_article_improve_combo.css', [], function(require, exports, module) {
	return ".selectTdClass{background-color:#edf5fa!important}table.noBorderTable td,table.noBorderTable th,table.noBorderTable caption{border:1px dashed #ddd!important}table{margin-bottom:10px;border-collapse:collapse;display:table;width:100%!important}td,th{word-wrap:break-word;word-break:break-all;padding:5px 10px;border:1px solid #DDD}caption{border:1px dashed #DDD;border-bottom:0;padding:3px;text-align:center}th{border-top:2px solid #BBB;background:#f7f7f7}.ue-table-interlace-color-single{background-color:#fcfcfc}.ue-table-interlace-color-double{background-color:#f7faff}td p{margin:0;padding:0}.res_iframe{display:block;width:100%;background-color:transparent;border:0}.shopcard_iframe{margin:14px 0;height:95px}.vote_area{display:block;position:relative;margin:14px 0;white-space:normal!important}.vote_iframe{display:block;width:100%;height:100%;background-color:transparent;border:0}form{display:none!important}@media screen and (min-width:0\\0) and (min-resolution:72dpi){.rich_media_content table{table-layout:fixed!important}.rich_media_content td,.rich_media_content th{width:auto!important}}.tc{text-align:center}.tl{text-align:left}.tr{text-align:right}.tips_global{color:#8c8c8c}.rich_split_tips{margin:20px 0;min-height:24px}.rich_media_tool_tips{margin-bottom:8px}.rich_media_tool{overflow:hidden;padding-top:15px;line-height:32px}.rich_media_tool .meta_primary{float:left;margin-right:10px}.rich_media_tool .meta_extra{float:right;margin-left:10px}.rich_media_tool .meta_praise{margin-right:0;margin-left:8px}.media_tool_meta i{vertical-align:0;position:relative;top:1px;margin-right:3px}.meta_praise{-webkit-tap-highlight-color:rgba(0,0,0,0);outline:0;min-width:3.5em}.meta_praise .praise_num{display:inline-block;vertical-align:top}.icon_praise_gray{background:transparent url(data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAA+CAYAAAA1dwvuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACd0lEQVRYhe2XMWhUMRjHfycdpDg4iJN26CQih4NUlFIc3iTasaAO+iZBnorIId2CDg6PLqWDXSy0p28TJ6ejILgoKiLFSeRcnASLnDf2HPKll8b3ah5NQPB+cHzJl0v+73J5Sf6NwWCAD6kqxoEV4BywCTwA2j59V9QlxrxUNJeBOSkfBtaAHvDcp\/O+GkJHJd4H7kr5nm\/nOkJHJH4FHkv5WAyhUxLfAgelvBlUKFXFBNCU6oYl+j6oEHohADwFtoDTUn8dTChVxX7gjlSfSJyS+CaYEDCPXs4d4IXkzDR+8BWqfI9SVUyil\/ENST20ml8BF4Afu4z9HT3V80B\/TAY9CxTABNAHxp1Oj4B1q34dWAamGa5Al0PALfSs3TS\/aE1EcERWgQXgozPIN+Ai6O2ljFQVM8BLZJqN0KTEhgj9kvrViqf1wYz5BcoXQ38Pg9uckfiuSigU0xLXowmlqpgCjgNd4FM0IeCKxGcmEUtoRqLZScILpaqYA06iN9\/tTTfGLzKvxLKdDCqUquIEcB59xK9GE2J4xLeBn3ZD1abaq\/sQqSpmgWvo82rBbTdCPeAA4N69\/noXS1XhphaBz27SPPVtapz\/FXSBFsNDcgcN3wvkiBEjRoSndAtqLXXKvuvtYfMs+SP3T3tYm6ge1iaqh7UJ62HRTqNZko\/mYV3CeVjA9rAuUTxsGd4edrcX1vWwddn2sHmWaA\/bWuq4HnYLff3aC7U8bAiaMPyPJp3GhnxCUOlhQxPdwxrieViLbp4lUT2sIbqHNcTzsBYbeZZE9bCGeB7WIrqHNbTzLNnhYWMIlXpYI9Rz8gM8\/GsFi3mW\/Ace9jf8QZwIX5o4uQAAAABJRU5ErkJggg==) no-repeat 0 0;width:13px;height:13px;vertical-align:middle;display:inline-block;-webkit-background-size:100% auto;background-size:100% auto}.icon_praise_gray.praised{background-position:0 -18px}.praised .icon_praise_gray{background-position:0 -18px}.rich_tips{margin-top:25px;margin-bottom:0;min-height:24px;text-align:center}.rich_tips .tips{display:inline-block;vertical-align:middle}.rich_tips .tips,.rich_tips .rich_icon{vertical-align:middle}.rich_tips .rich_icon{margin-top:-3px 5px 0 0}.rich_tips.with_line{border-top:1px dotted #e1e1e1}.rich_tips.with_line .tips{position:relative;top:-12px;padding-left:16px;padding-right:16px;background-color:#f3f3f3}.rich_tips.with_line{line-height:16px}.rich_tips.with_line .tips{top:-11px;padding-left:.35em;padding-right:.35em}.title_tips .tips{color:#868686;font-size:16px}.loading_tips{margin:36px 0 20px}.title_bottom_tips{margin-top:-10px}.icon_arrow_gray{width:7px}.icon_loading_white{width:16px}.icon_loading_white.icon_before{margin-right:1em}.icon_loading_white.icon_after{margin-left:1em}.btn{display:block;padding-left:14px;padding-right:14px;font-size:18px;text-align:center;text-decoration:none;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;color:#fff;line-height:42px;-webkit-tap-highlight-color:rgba(255,255,255,0)}.btn.btn_inline{display:inline-block}.btn_primary{background-color:#04be02}.btn_primary:not(.btn_disabled):visited{color:#fff}.btn_primary:not(.btn_disabled):active{color:rgba(255,255,255,0.4);background-color:#039702}.btn_disabled{color:rgba(255,255,255,0.6)}.sougou_body .rich_media_area_primary{margin-top:10px}.sougou_body .rich_media_area_primary:first-child{margin-top:0}.sougou_body .rich_media_area_primary.sougou ul{padding-left:0;list-style-type:none}.sougou_body .rich_media_area_extra{margin-top:10px;background-color:#fff}.sougou_body .rich_media_area_title{font-size:16px;margin-bottom:.5em}.sougou_body .relate_article_list{font-size:15px}.sougou_body .relate_article_link{display:block;padding:.35em 0;color:#8c8c8c;-webkit-tap-highlight-color:rgba(0,0,0,0)}.sougou_body .rich_tips.discuss_title_line{text-align:left;margin-top:0;padding:20px 0 .5em;border-width:0;line-height:1.6}.sougou_body .rich_tips.discuss_title_line .tips{position:static;padding:0;color:#3e3e3e}.sougou_body .rich_tips.with_line .tips{background-color:#fff}.sougou_body .rich_split_tips{margin:0;padding:20px 0}.sougou_body .rich_media_extra .loading_tips{margin:0;padding:20px 0}.emotion_tool{position:relative;overflow:hidden}.pic_emotion_switch_wrp{margin-left:15px;margin-bottom:6px;display:inline-block;font-size:0}.pic_emotion_switch_wrp img{width:35px;display:block}.pic_emotion_switch_wrp .pic_active{display:none}.pic_emotion_switch_wrp:active .pic_default{display:none}.pic_emotion_switch_wrp:active .pic_active{display:block}.emotion_switch{margin-left:15px;margin-bottom:6px;background:transparent url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/appmsg\/emotion\/icon_emotion_tool.2x278965.png) no-repeat 0 0;width:35px;height:35px;vertical-align:middle;display:inline-block;-webkit-background-size:35px auto;background-size:35px auto}.emotion_switch:active{background-position:0 -40px}.emotion_panel_arrow_wrp{position:absolute;margin-top:-6px;margin-left:26px}.emotion_panel_arrow_wrp .emotion_panel_arrow{position:absolute;display:inline-block;width:0;height:0;border-width:6px;border-style:dashed;border-color:transparent;border-top-width:0;border-bottom-color:#e5e5e7;border-bottom-style:solid}.emotion_panel_arrow_wrp .arrow_in{border-bottom-color:#f6f6f8;top:1px}.emotion_panel{background-color:#f6f6f8;position:relative}.emotion_panel:before{content:\" \";position:absolute;left:0;top:0;right:0;height:1px;border-top:1px solid #e3e3e5;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleY(0.5);transform:scaleY(0.5)}.emotion_panel:after{content:\" \";position:absolute;left:0;bottom:0;right:0;height:1px;border-bottom:1px solid #e3e3e5;-webkit-transform-origin:0 100%;transform-origin:0 100%;-webkit-transform:scaleY(0.5);transform:scaleY(0.5)}.emotion_list_wrp{overflow:hidden;position:relative;font-size:0;white-space:nowrap}.emotion_list{padding:10px 15px 0;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;white-space:normal;display:inline-block;vertical-align:top}.emotion_list:last-child .emotion_item.del{position:absolute;bottom:0;right:18px}.emotion_item{display:inline-block;width:36px;height:36px;margin-bottom:5px;text-align:center;line-height:36px}.emotion_navs{text-align:center;padding-bottom:5px}.emotion_nav{display:inline-block;width:8px;height:8px;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;overflow:hidden;background-color:#bbb;margin:0 5px}.emotion_nav.current{background-color:#8c8c8c}.icon_emotion{width:22px;height:22px;vertical-align:middle;display:inline-block;background:transparent url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/icon_emotion_panel.2x3518c7.png) no-repeat 0 0;-webkit-background-size:22px auto;background-size:22px auto}.icon_emotion.del{background:transparent url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/appmsg\/emotion\/icon_emotion_tool.2x278965.png) no-repeat 0 0;width:28px;height:28px;vertical-align:middle;display:inline-block;background-position:2px -62px;-webkit-background-size:28px auto;background-size:28px auto}.icon_emotion.del:active{background-position:2px -92px}.icon_emotion_single{width:22px;height:22px;vertical-align:middle;display:inline-block;-webkit-background-size:22px auto;background-size:22px auto}.icon_smiley_0{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_03518c7.png)}.icon_smiley_1{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_13518c7.png)}.icon_smiley_2{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_23518c7.png)}.icon_smiley_3{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_33518c7.png)}.icon_smiley_4{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_43518c7.png)}.icon_smiley_5{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_53518c7.png)}.icon_smiley_6{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_63518c7.png)}.icon_smiley_7{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_73518c7.png)}.icon_smiley_8{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_83518c7.png)}.icon_smiley_9{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_93518c7.png)}.icon_smiley_10{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_103518c7.png)}.icon_smiley_11{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_113518c7.png)}.icon_smiley_12{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_123518c7.png)}.icon_smiley_13{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_133518c7.png)}.icon_smiley_14{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_143518c7.png)}.icon_smiley_15{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_153518c7.png)}.icon_smiley_17{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_173518c7.png)}.icon_smiley_18{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_183518c7.png)}.icon_smiley_19{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_193518c7.png)}.icon_smiley_20{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_203518c7.png)}.icon_smiley_21{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_213518c7.png)}.icon_smiley_22{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_223518c7.png)}.icon_smiley_23{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_233518c7.png)}.icon_smiley_25{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_253518c7.png)}.icon_smiley_26{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_263518c7.png)}.icon_smiley_27{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_273518c7.png)}.icon_smiley_28{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_283518c7.png)}.icon_smiley_29{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_293518c7.png)}.icon_smiley_30{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_303518c7.png)}.icon_smiley_31{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_313518c7.png)}.icon_smiley_32{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_323518c7.png)}.icon_smiley_33{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_333518c7.png)}.icon_smiley_34{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_343518c7.png)}.icon_smiley_36{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_363518c7.png)}.icon_smiley_37{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_373518c7.png)}.icon_smiley_38{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_383518c7.png)}.icon_smiley_39{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_393518c7.png)}.icon_smiley_40{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_403518c7.png)}.icon_smiley_41{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_413518c7.png)}.icon_smiley_42{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_423518c7.png)}.icon_smiley_44{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_443518c7.png)}.icon_smiley_45{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_453518c7.png)}.icon_smiley_46{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_463518c7.png)}.icon_smiley_47{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_473518c7.png)}.icon_smiley_48{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_483518c7.png)}.icon_smiley_49{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_493518c7.png)}.icon_smiley_50{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_503518c7.png)}.icon_smiley_51{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_513518c7.png)}.icon_smiley_52{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_523518c7.png)}.icon_smiley_54{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_543518c7.png)}.icon_smiley_55{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_553518c7.png)}.icon_smiley_56{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_563518c7.png)}.icon_smiley_57{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_573518c7.png)}.icon_smiley_60{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_603518c7.png)}.icon_smiley_62{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_623518c7.png)}.icon_smiley_63{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_633518c7.png)}.icon_smiley_64{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_643518c7.png)}.icon_smiley_65{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_653518c7.png)}.icon_smiley_66{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_663518c7.png)}.icon_smiley_67{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_673518c7.png)}.icon_smiley_68{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_683518c7.png)}.icon_smiley_70{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_703518c7.png)}.icon_smiley_74{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_743518c7.png)}.icon_smiley_75{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_753518c7.png)}.icon_smiley_76{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_763518c7.png)}.icon_smiley_78{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_783518c7.png)}.icon_smiley_79{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_793518c7.png)}.icon_smiley_80{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_803518c7.png)}.icon_smiley_81{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_813518c7.png)}.icon_smiley_82{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_823518c7.png)}.icon_smiley_83{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_833518c7.png)}.icon_smiley_84{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_843518c7.png)}.icon_smiley_85{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_853518c7.png)}.icon_smiley_89{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_893518c7.png)}.icon_smiley_92{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_923518c7.png)}.icon_smiley_93{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_933518c7.png)}.icon_smiley_94{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_943518c7.png)}.icon_smiley_95{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/smiley\/smiley_953518c7.png)}.icon_emoji_ios_0{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_ios\/u1F6043518c7.png)}.icon_emoji_ios_1{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_ios\/u1F6373518c7.png)}.icon_emoji_ios_2{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_ios\/u1F6023518c7.png)}.icon_emoji_ios_3{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_ios\/u1F61D3518c7.png)}.icon_emoji_ios_4{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_ios\/u1F6333518c7.png)}.icon_emoji_ios_5{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_ios\/u1F6313518c7.png)}.icon_emoji_ios_6{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_ios\/u1F6143518c7.png)}.icon_emoji_ios_7{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_ios\/u1F6123518c7.png)}.icon_emoji_wx_4{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_wx\/2_043518c7.png)}.icon_emoji_wx_5{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_wx\/2_053518c7.png)}.icon_emoji_wx_2{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_wx\/2_023518c7.png)}.icon_emoji_wx_6{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_wx\/2_063518c7.png)}.icon_emoji_wx_12{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_wx\/2_123518c7.png)}.icon_emoji_wx_11{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_wx\/2_113518c7.png)}.icon_emoji_ios_8{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_ios\/u1F47B3518c7.png)}.icon_emoji_ios_9{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_ios\/u1F64F.03518c7.png)}.icon_emoji_ios_10{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_ios\/u1F4AA.03518c7.png)}.icon_emoji_ios_11{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_ios\/u1F3893518c7.png)}.icon_emoji_ios_12{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_ios\/u1F3813518c7.png)}.icon_emoji_wx_9{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_wx\/2_093518c7.png)}.icon_emoji_wx_14{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/common\/emotion_panel\/emoji_wx\/2_143518c7.png)}.wx_poptips{position:fixed;z-index:3;width:120px;min-height:120px;top:180px;left:50%;margin-left:-60px;background:rgba(40,40,40,0.5)!important;filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='#80282828',endcolorstr = '#80282828');text-align:center;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;color:#fff}.wx_poptips .icon_toast{width:53px;margin:15px 0 0}.wx_poptips .toast_content{margin:0 0 15px}.discuss_container .rich_media_title{font-size:18px}.discuss_container.disabled .btn_discuss{color:#60f05f}.discuss_container.access .discuss_container_inner{padding:15px 15px 0}.discuss_container.editing .discuss_container_inner{padding-bottom:25px}.discuss_container.editing .frm_textarea_box_wrp{margin:0 -15px}.discuss_container.editing .frm_textarea{height:78px;-webkit-overflow-scrolling:touch}.discuss_container.editing .frm_append.counter{display:block}.discuss_container.editing .discuss_btn_wrp{display:block}.discuss_container.editing .discuss_icon_tips{margin-top:0;margin-bottom:-14px}.discuss_container.editing .discuss_title_line{margin-bottom:-20px}.discuss_container.warning .counter{color:#e15f63}.frm_textarea{width:100%;background-color:transparent;border:0;display:block;font-size:14px;-webkit-box-sizing:border-box;box-sizing:border-box;height:37px;padding:10px 15px;resize:none;outline:0;-webkit-tap-highlight-color:rgba(0,0,0,0)}.frm_textarea_box_wrp{position:relative}.frm_textarea_box_wrp:before{content:\" \";position:absolute;left:0;top:0;width:100%;height:1px;border-top:1px solid #e7e6e4;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleY(0.5);transform:scaleY(0.5);top:-1px}.frm_textarea_box_wrp:after{content:\" \";position:absolute;left:0;top:0;width:100%;height:1px;border-top:1px solid #e7e6e4;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleY(0.5);transform:scaleY(0.5);top:auto;bottom:-2px}.frm_textarea_box{display:block;background-color:#fff}.frm_append.counter{display:none;position:absolute;right:8px;bottom:8px;color:#a3a3a3;font-weight:400;font-style:normal;font-size:12px}.frm_append .current_num.warn{color:#f43631}.discuss_btn_wrp{display:none;margin-top:20px;margin-bottom:20px;text-align:right}.btn_discuss{padding-left:1.5em;padding-right:1.5em}.discuss_list{margin-top:-5px;padding-bottom:20px;font-size:16px}.discuss_item{position:relative;padding-left:45px;margin-top:26px;*zoom:1}.discuss_item:after{content:\"\\200B\";display:block;height:0;clear:both}.discuss_item .user_info{min-height:20px;overflow:hidden}.discuss_item .nickname{display:inline-block;vertical-align:middle;font-weight:400;font-style:normal;color:#727272;width:auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;max-width:9em}.discuss_item .avatar{position:absolute;top:0;left:0;top:3px;width:35px;height:35px;background-color:#ccc;vertical-align:top;margin-top:0;border-radius:2px;-moz-border-radius:2px;-webkit-border-radius:2px}.discuss_item .discuss_message{word-wrap:break-word;-webkit-hyphens:auto;-ms-hyphens:auto;hyphens:auto;overflow:hidden;color:#3e3e3e;line-height:1.5}.discuss_item .discuss_message_content{white-space:pre-wrap}.discuss_item .discuss_extra_info{color:#bdbdbd;font-size:13px}.discuss_item .discuss_extra_info a{margin-left:.5em}.discuss_item .discuss_status{color:#ff7a21;white-space:nowrap}.discuss_item .discuss_status i{font-style:normal;margin-right:2px}.discuss_item .discuss_opr{float:right}.discuss_item .discuss_opr .meta_praise{display:inline-block;text-align:right;padding-top:5px;margin-top:-5px}.discuss_item .discuss_opr .praise_num{-webkit-user-select:none;user-select:none}.discuss_item .discuss_del{margin-left:.5em}.discuss_icon_tips{margin-bottom:20px}.discuss_icon_tips img{vertical-align:middle;margin-left:3px;margin-top:-4px}.discuss_icon_tips .icon_edit{width:12px}.discuss_icon_tips .icon_access{width:13px}.reply_result{position:relative;margin-top:.5em;padding-top:.5em;padding-left:.4em}.reply_result:before{content:\" \";position:absolute;left:0;top:0;right:0;height:1px;border-top:1px solid #dadada;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleY(0.5);transform:scaleY(0.5)}.reply_result .discuss_message{clear:both}.reply_result .nickname{position:relative;overflow:visible}.reply_result .nickname:before{content:\" \";position:absolute;left:-0.4em;top:50%;margin-top:-7px;width:3px;height:14px;background-color:#02bb00}.rich_tips.discuss_title_line{margin-top:50px}.icon_discuss_top{display:inline-block;vertical-align:middle;padding:1px .5em;border:1px solid #bdbdbd;color:#bdbdbd;border-top-left-radius:.7em 50%;-moz-border-radius-topleft:.7em 50%;-webkit-border-top-left-radius:.7em 50%;border-top-right-radius:.7em 50%;-moz-border-radius-topright:.7em 50%;-webkit-border-top-right-radius:.7em 50%;border-bottom-left-radius:.7em 50%;-moz-border-radius-bottomleft:.7em 50%;-webkit-border-bottom-left-radius:.7em 50%;border-bottom-right-radius:.7em 50%;-moz-border-radius-bottomright:.7em 50%;-webkit-border-bottom-right-radius:.7em 50%;font-size:12px;line-height:1;margin-top:-1px;margin-left:.5em}@media screen and (device-aspect-ratio:2\/3),screen and (device-aspect-ratio:40\/71){.icon_discuss_top{font-size:11px;line-height:1.1;padding-top:0}}.reward_area{padding:38px 5% 20px;-webkit-box-sizing:border-box;box-sizing:border-box;margin:0 auto}.reward_area_inner{margin:0 auto;position:relative;left:3px}.reward_access{display:inline-block;padding:0 1.6em;line-height:2;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;background-color:#dc5d4a;color:#fff;font-size:16px;-webkit-tap-highlight-color:rgba(0,0,0,0)}.reward_access:active{background-color:#be5041;color:#e69990}.reward_tips{margin-bottom:5px}.reward_user_tips{margin-top:1.4em}.reward_user_list{padding-top:.5em;overflow:hidden}.reward_user_avatar{display:inline-block;vertical-align:top;width:28px;height:28px;margin:0 6px 6px 0}.reward_user_avatar img{width:100%;height:100%!important}.reward_user_avatar.readmore{-webkit-tap-highlight-color:rgba(0,0,0,0)}.reward_qrcode_area{margin:38px 0 20px;padding:30px 20px;font-size:14px;border:1px solid #ebebeb}.reward_qrcode_area p{word-wrap:break-word;word-break:break-all}.reward_qrcode_area .tips_global{font-size:13px}.reward_qrcode_area .reward_money{font-size:30px;margin-top:.6em;margin-bottom:-0.1em;line-height:1;font-family:\"WeChatNumber-151125\"}.reward_qrcode_area .reward_tips{margin-top:1em;margin-bottom:0}.reward_qrcode_img_wrp{width:200px;height:200px;background-color:#fff;display:block;margin:1.5em auto 1.6em}.reward_qrcode_img{width:100%;height:100%;display:block}@font-face{font-weight:normal;font-style:normal;font-family:\"WeChatNumber-151125\";src:url('https:\/\/res.wx.qq.com\/mmbizwap\/en_US\/htmledition\/assets\/WeChatNumber-170206.ttf') format('truetype')}@media(min-device-width:414px){.reward_qrcode_area .tips_global{line-height:1.8}.reward_qrcode_area .reward_money{margin-top:.6em}.reward_qrcode_area .reward_tips{margin-top:1.2em}.reward_qrcode_img_wrp{width:224px;height:224px;margin:1.8em auto}}.rich_media_extra{position:relative}.rich_media_extra .extra_link{display:block}.rich_media_extra img{vertical-align:middle;margin-top:-3px}.rich_media_extra .appmsg_banner{width:100%}.rich_media_extra .ad_msg_mask{position:absolute;left:0;top:0;width:100%;height:100%;text-align:center;line-height:200px;background-color:#000;filter:alpha(opacity = 20);-moz-opacity:.2;-khtml-opacity:.2;opacity:.2}.mpda_bottom_container .rich_media_extra{padding-bottom:15px}.btn_default.btn_line,.btn_primary.btn_line{background-color:#fff;color:#04be02;border:1px solid #04be02;font-size:15px}.rich_media_extra .extra_link{position:relative}.promotion_tag{position:absolute;display:block;height:21px;line-height:21px;width:79px;background:transparent url(\/mmbizwap\/en_US\/htmledition\/images\/ad\/promotion_tag_bg_primary2c7544.png) no-repeat 0 0;background-position:100% 0;-webkit-background-size:79px 21px;background-size:79px 21px;font-size:14px;font-style:normal;color:#fff;padding-right:6px;text-align:right;right:0;bottom:0}.brand_logo{position:absolute;display:block;width:24%;right:1.54%;top:0}.brand_logo img{width:100%;vertical-align:top;max-height:35px}.top_banner{background-color:#fff}.top_banner .rich_media_extra{padding:15px 15px 20px 15px}.top_banner .rich_media_extra .extra_link{position:relative;padding-bottom:10px}.top_banner .rich_media_extra .extra_link:before{content:\" \";position:absolute;left:0;top:0;width:100%;height:1px;border-top:1px solid #d6d6d6;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleY(0.5);transform:scaleY(0.5);top:auto;bottom:-2px}.top_banner .rich_media_extra .extra_link:active,.top_banner .rich_media_extra .extra_link:focus{outline:0;border:0}.top_banner .rich_media_extra .appmsg_banner{width:100%;vertical-align:top;outline:0}.top_banner .rich_media_extra .appmsg_banner:active,.top_banner .rich_media_extra .appmsg_banner:focus{outline:0;border:0}.top_banner .rich_media_extra .promotion_tag{height:19px;line-height:19px;width:69px;background:transparent url(\/mmbizwap\/en_US\/htmledition\/images\/ad\/promotion_tag_bg_small24a2ff.png) no-repeat 0 0;font-size:12px;-webkit-background-size:69px 19px;background-size:69px 19px;bottom:10px;padding-left:6px}.top_banner .rich_media_extra .brand_logo{width:20%;right:2.22%}.top_banner .rich_media_extra .brand_logo img{max-height:35px}.top_banner .rich_media_extra .ad_msg_mask{position:absolute;left:0;top:0;width:100%;height:100%;text-align:center;line-height:200px;background-color:#000;filter:alpha(opacity = 20);-moz-opacity:.2;-khtml-opacity:.2;opacity:.2}.top_banner .rich_media_extra .ad_msg_mask img{position:absolute;width:16px;top:50%;margin-top:-8px;left:50%;margin-left:-8px}.top_banner .preview_group.obvious_app{min-height:54px;position:relative}.top_banner .preview_group.obvious_app .pic_app{width:66.6%}.top_banner .preview_group.obvious_app .pic_app img{height:100%;min-height:54px}.top_banner .preview_group.obvious_app .info_app{width:33%;left:68%}.top_banner .preview_group.obvious_app .info_app .name_app{line-height:18px;font-size:13px}.top_banner .preview_group.obvious_app .info_app .profile_app{font-size:10px}.top_banner .preview_group.obvious_app .info_app .dm_app{bottom:5px}.top_banner .preview_group.obvious_app .info_app .dm_app .ad_btn{font-size:12px;padding-left:17px;line-height:16px}.top_banner .preview_group.obvious_app .info_app .dm_app .ad_btn.btn_download,.top_banner .preview_group.obvious_app .info_app .dm_app .ad_btn.btn_install,.top_banner .preview_group.obvious_app .info_app .dm_app .ad_btn.btn_installed,.top_banner .preview_group.obvious_app .info_app .dm_app .ad_btn.btn_open{-webkit-background-size:14px 14px;background-size:14px 14px;background-position:0 center;-webkit-background-position:0 center}.top_banner .preview_group.obvious_app .info_app .dm_app .extra_info{display:none}.wrp_preview_group{padding-top:100px}.preview_group{position:relative;min-height:83px;background-color:#fff;border:1px solid #e7e7eb;-webkit-text-size-adjust:none;text-size-adjust:none}.preview_group.fixed_pos{position:fixed;bottom:0;left:0;right:0}.preview_group .preview_group_inner{padding:14px}.preview_group .preview_group_inner .preview_group_info{padding-left:68px;color:#8d8d8d;font-size:14px}.preview_group .preview_group_inner .preview_group_info .preview_group_title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;color:#000;font-weight:400;font-style:normal;padding-right:73px;max-width:142px;display:block}.preview_group .preview_group_inner .preview_group_info .preview_group_desc{padding-right:65px;display:inline-block;line-height:20px}.preview_group .preview_group_inner .preview_group_info .preview_group_avatar{position:absolute;width:55px;height:55px;left:13px;top:50%;margin-top:-27px;z-index:1}.preview_group .preview_group_inner .preview_group_info .preview_group_avatar.br_radius{border-radius:100%;-moz-border-radius:100%;-webkit-border-radius:100%}.preview_group .preview_group_inner .preview_group_opr{position:absolute;line-height:83px;top:0;right:13px}.preview_group .preview_group_inner .preview_group_opr .btn{padding:0;min-width:60px;min-height:30px;height:auto;line-height:30px;text-align:center}.preview_group.preview_card .card_inner{padding:0;min-height:89px}.preview_group.preview_card .card_inner .preview_card_avatar{position:absolute;width:89px;height:89px!important;margin:0;left:0;top:0}.preview_group.preview_card .card_inner .preview_group_info{padding:10px 12px 0 106px}.preview_group.preview_card .card_inner .preview_group_info .preview_group_title2{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;padding-right:0;display:block;color:#3e3e3e;font-weight:400}.preview_group.preview_card .card_inner .preview_group_info .preview_group_desc{padding-right:0;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-height:1.3}.preview_group.preview_card .card_inner .preview_group_info.append_btn .preview_group_desc,.preview_group.preview_card .card_inner .preview_group_info.append_btn .preview_group_title{padding-right:68px;width:auto}.preview_group.preview_shop_card .shop_card_inner{padding:0;min-height:96px}.preview_group.preview_shop_card .preview_card_avatar{position:absolute;width:96px;height:96px!important;margin:0;left:0;top:0}.preview_group.preview_shop_card .preview_group_info{padding:10px 12px 0 111px}.preview_group.preview_shop_card .preview_shop_card_title{display:block;color:#3e3e3e;font-weight:400;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-height:1.3;font-size:15px}.preview_group.preview_shop_card .preview_shop_card_desc{color:#8c8c8c;position:absolute;bottom:6px;left:111px;right:12px}.preview_group.preview_shop_card .preview_shop_card_price{font-size:16px;color:#3e3e3e}.preview_group.preview_shop_card .preview_shop_card_oldprice{text-decoration:line-through;color:#8c8c8c;font-size:13px;margin-bottom:-0.5em}.preview_group.preview_shop_card .preview_shop_card_price,.preview_group.preview_shop_card .preview_shop_card_oldprice{display:block}.preview_group.preview_shop_card .preview_shop_card_btn_buy{float:right;line-height:1.75;font-size:16px;padding:0 .8em;border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px;margin-top:1px}.preview_group.obvious_app{width:100%}.preview_group.obvious_app .preview_group_inner{padding:0}.preview_group.obvious_app .pic_app{width:58.3%;height:100%;display:inline-block;margin-right:2%;vertical-align:top}.preview_group.obvious_app .pic_app img{width:100%;vertical-align:top;margin-top:0}.preview_group.obvious_app .info_app{display:inline-block;width:38%;color:#8a8a8a;font-size:12px;box-sizing:border-box;-webkit-box-sizing:border-box;position:absolute;left:62%;top:0;height:100%}.preview_group.obvious_app .info_app .name_app{color:#000;font-size:15px;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;margin-top:3px}.preview_group.obvious_app .info_app .profile_app{line-height:10px;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal}.preview_group.obvious_app .info_app .profile_app span{padding:0 5px}.preview_group.obvious_app .info_app .profile_app span:first-child{padding-left:0}.preview_group.obvious_app .info_app .profile_app em{font-size:9px;line-height:16px;font-weight:400;font-style:normal;color:#dfdfdf}.preview_group.obvious_app .info_app .dm_app{line-height:20px;vertical-align:middle;position:absolute;left:0;bottom:5px}.preview_group.obvious_app .info_app .dm_app .ad_btn{display:block;color:#04be02;font-size:15px;padding-left:22px}.preview_group.obvious_app .info_app .dm_app .ad_btn.btn_download{background:transparent url(http:\/\/res.wx.qq.com\/mmbizwap\/en_US\/htmledition\/images\/ad\/icon58_download@3x.png) no-repeat 0 0;-webkit-background-size:19px 19px;background-size:16px 16px;-webkit-background-position:0 center;background-position:0 center}.preview_group.obvious_app .info_app .dm_app .ad_btn.btn_install{background:transparent url(http:\/\/res.wx.qq.com\/mmbizwap\/en_US\/htmledition\/images\/ad\/icon58_install@3x.png) no-repeat 0 0;-webkit-background-size:19px 19px;background-size:16px 16px;-webkit-background-position:0 center;background-position:0 center}.preview_group.obvious_app .info_app .dm_app .ad_btn.btn_installed{background:transparent url(http:\/\/res.wx.qq.com\/mmbizwap\/en_US\/htmledition\/images\/ad\/icon58_installed@3x.png) no-repeat 0 0;-webkit-background-size:19px 19px;background-size:16px 16px;color:#8a8a8a;-webkit-background-position:0 center;background-position:0 center}.preview_group.obvious_app .info_app .dm_app .ad_btn.btn_open{background:transparent url(http:\/\/res.wx.qq.com\/mmbizwap\/en_US\/htmledition\/images\/ad\/icon58_open@3x.png) no-repeat 0 0;-webkit-background-size:19px 19px;background-size:16px 16px;-webkit-background-position:0 center;background-position:0 center}.preview_group.obvious_app .info_app .dm_app p{line-height:15px}.preview_group.obvious_app .info_app .dm_app .extra_info{font-size:9px}.preview_group.obvious_app .info_app .grade_app{height:11px;line-height:11px;font-size:12px;color:#888}.preview_group.obvious_app .info_app .grade_app .stars{display:inline-block;width:55px;height:11px;background:transparent url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/appmsg\/star_sprite25624b.png) no-repeat 0 0;-webkit-background-size:55px 110px;background-size:55px 110px}.preview_group.obvious_app .info_app .grade_app .stars.star_half{backgroud-position:0}.preview_group.obvious_app .info_app .grade_app .stars.star_one{background-position:0 -11px}.preview_group.obvious_app .info_app .grade_app .stars.star_one_half{background-position:0 -22px}.preview_group.obvious_app .info_app .grade_app .stars.star_two{background-position:0 -33px}.preview_group.obvious_app .info_app .grade_app .stars.star_two_half{background-position:0 -44px}.preview_group.obvious_app .info_app .grade_app .stars.star_three{background-position:0 -55px}.preview_group.obvious_app .info_app .grade_app .stars.star_three_half{background-position:0 -66px}.preview_group.obvious_app .info_app .grade_app .stars.star_four{background-position:0 -77px}.preview_group.obvious_app .info_app .grade_app .stars.star_four_half{background-position:0 -88px}.preview_group.obvious_app .info_app .grade_app .stars.star_five{background-position:0 -99px}.preview_group.download_app_with_desc{border:0;color:#fff;font-weight:400}.preview_group.download_app_with_desc .preview_group_inner{position:relative;background-repeat:no-repeat;background-position:center;background-size:cover;height:100%;width:100%;box-sizing:border-box;padding:0;overflow:hidden}.preview_group.download_app_with_desc .preview_group_hd{position:relative;z-index:9;width:24%;text-align:center;display:-webkit-box;-webkit-box-orient:horizontal;-webkit-box-pack:center;-webkit-box-align:center;display:box;box-orient:horizontal;box-pack:center;box-align:center;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;height:100%;float:right;margin-right:2.875%}.preview_group.download_app_with_desc .preview_group_hd .preview_card_avatar{width:45%;height:45%!important;margin:0;border-radius:18%}.preview_group.download_app_with_desc .preview_group_hd .preview_group_title{display:block;font-weight:400;font-size:12px;padding-top:4%;padding-bottom:8%;width:auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal}.preview_group.download_app_with_desc .preview_group_hd .preview_group_btn{display:block;margin:0 auto;font-size:14px;padding:6.5% 0;line-height:1;width:72%;text-align:center;border:1px solid #fff;border-radius:5px;color:#fff;-webkit-tap-highlight-color:transparent}.preview_group.download_app_with_desc .preview_group_hd_inner{-webkit-box-flex:1;-webkit-flex:1;flex:1}.preview_group.download_app_with_desc .preview_group_btn.with_processor{position:relative;overflow:hidden}.preview_group.download_app_with_desc .preview_group_btn.with_processor .btn_processor{display:block;position:absolute;top:0;left:0;width:100%;height:100%;background-color:#04be02}.preview_group.download_app_with_desc .preview_group_btn.with_processor .btn_processor_value{position:relative}.preview_group.download_app_with_img .preview_card_avatar{box-shadow:0 -1px 2px rgba(0,0,0,0.2)}.preview_group.download_app_with_desc{overflow:hidden}.preview_group.download_app_with_desc .preview_group_bg{width:100%;height:100%;position:absolute;background-repeat:no-repeat;background-position:center;background-size:cover;z-index:0;-webkit-filter:blur(30px);-moz-filter:blur(30px);-o-filter:blur(30px);-ms-filter:blur(30px);filter:blur(30px)}.preview_group.download_app_with_desc .preview_group_bd{position:absolute;left:2.875%;right:26%;top:46%;transform:translateY(-50%);-webkit-transform:translateY(-50%);-moz-transform:translateY(-50%);-ms-transform:translateY(-50%);text-align:center}.preview_group.download_app_with_desc .preview_group_ft{position:absolute;left:2.875%;right:26%;bottom:26%;transform:translateY(50%);-webkit-transform:translateY(50%);-moz-transform:translateY(50%);-ms-transform:translateY(50%);text-align:center}.preview_group.download_app_with_desc .preview_group_desc{display:block;font-size:17px;line-height:1.5;width:12em;margin:0 auto;overflow-x:hidden;white-space:nowrap}.preview_group.download_app_with_desc .preview_group_download_info{display:inline-block;font-size:9px}.preview_group.follow .preview_group_inner .preview_group_info .preview_group_desc{display:block}.preview_group.follow.with_tips .preview_group_desc{width:auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal}.preview_group.follow .weak_tips{color:#bbb}.btn_plain_primary{color:#04be02;border:1px solid #04be02}.btn_plain_primary:active{border-color:#039702}.mpda_card .btn{padding:0;font-size:15px}.mpda_card .btn_inline{width:4em;line-height:2}.mpda_card .cardticket_hd{background-color:#fff;border-top-left-radius:5px;-moz-border-radius-topleft:5px;-webkit-border-top-left-radius:5px;border-top-right-radius:5px;-moz-border-radius-topright:5px;-webkit-border-top-right-radius:5px;border:1px solid #ececec;border-bottom-width:0}.mpda_card .cardticket_hd .radius_avatar{width:45px;height:45px}.mpda_card .cardticket_hd .cell_hd{padding-left:12px}.mpda_card .cardticket_hd .cell_bd{font-size:17px;padding-left:.5em}.mpda_card .cardticket_hd .cell_ft{padding-right:10px}.mpda_card .cardticket_ft{position:relative;margin-top:10px;padding:.35em 12px;font-size:12px;background-color:#fff;border-bottom-left-radius:5px;-moz-border-radius-bottomleft:5px;-webkit-border-bottom-left-radius:5px;border-bottom-right-radius:5px;-moz-border-radius-bottomright:5px;-webkit-border-bottom-right-radius:5px;border:1px solid #ececec;border-top-width:0}.mpda_card .cardticket_theme{position:absolute;top:-10px;left:8px;right:8px;height:10px;background:transparent url(\/mmbizwap\/en_US\/htmledition\/images\/pic\/appmsg\/cardticket_theme\/pic_circle290774.png) no-repeat 0 0;background-repeat:repeat-x;-webkit-background-size:10px auto;background-size:10px auto}.mpda_card .cardticket_theme:before{content:\" \";position:absolute;left:-8px;top:0;background:transparent url(\/mmbizwap\/en_US\/htmledition\/images\/pic\/appmsg\/cardticket_theme\/pic_circle_left290774.png) no-repeat 0 0;width:8px;height:10px;vertical-align:middle;display:inline-block;-webkit-background-size:8px auto;background-size:8px auto}.mpda_card .cardticket_theme:after{content:\" \";position:absolute;right:-8px;top:0;background:transparent url(\/mmbizwap\/en_US\/htmledition\/images\/pic\/appmsg\/cardticket_theme\/pic_circle_right290774.png) no-repeat 0 0;width:8px;height:10px;vertical-align:middle;display:inline-block;-webkit-background-size:8px auto;background-size:8px auto}@media(max-width:354px){.preview_group.download_app_with_desc .preview_group_bd{top:45%}.preview_group.download_app_with_desc .preview_group_desc{font-size:16px;line-height:1.4}.preview_group.download_app_with_desc .preview_group_hd .preview_group_title{padding-top:3%;padding-bottom:6%}.preview_group.download_app_with_desc .preview_group_hd .preview_group_btn{font-size:13px}}@media(min-width:400px){.preview_group.download_app_with_desc .preview_group_bd{top:45%}.preview_group.download_app_with_desc .preview_group_desc{font-size:18px}}.wx_flex_layout{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.wx_flex_bd{-webkit-box-flex:1;-webkit-flex:1;flex:1;word-wrap:break-word;word-break:break-all}.wx_flex_ft{text-align:center}.mod_follow_with_img .wx_flex_ft{width:32%}.mod_follow_with_img .fwi_thumb{margin:0;display:block;width:100%}.mod_follow_with_img .radius_avatar{width:35px;height:35px;padding:0}.mod_follow_with_img .radius_avatar img{margin:0}.mod_follow_with_img .fwi_nickname{width:auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;display:block;margin:.2em 1em .5em;font-weight:400;font-size:12px;color:#8c8c8c}.wx_min_plain_btn{display:inline-block;vertical-align:middle;padding:0 .85em;line-height:1.6em;font-size:15px;-webkit-tap-highlight-color:rgba(0,0,0,0);border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px}.wx_min_plain_btn.primary{color:#1aad19;border:1px solid #1aad19}.wx_min_plain_btn.primary:active{color:rgba(26,173,25,0.6);border-color:rgba(26,173,25,0.6)}span.img_bg_cover{background-repeat:no-repeat;background-position:center center;background-size:cover}.ct_mpda_wrp{margin:38px 0 20px}.ct_mpda_area{position:relative;-webkit-box-sizing:border-box;box-sizing:border-box;background-color:#fcfcfc;border:1px solid #ebebeb;-webkit-user-select:none;user-select:none}.ct_mpda_placeholder{position:absolute;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);width:100%}.ct_mpda_tips{color:#d8d8d8;text-align:center;font-size:15px}.ct_mpda_inner{position:relative;width:100%;opacity:0;transition:opacity .6s;-webkit-transition:opacity .6s}.ct_mpda_area.show .ct_mpda_inner{opacity:1}.ct_mpda_main_img{width:100%;min-height:100px;display:block}.ct_mpda_hd .page_video{min-height:0}.ct_mpda_bd{width:100%;position:relative;border-top:1px solid #ebebeb;box-sizing:border-box;white-space:nowrap}.ct_mpda_logo{width:35px;height:35px;display:inline-block;margin:15px 10px;vertical-align:middle;border-radius:50%;overflow:hidden}.ct_mpda_desc_box{font-size:0;display:inline-block;vertical-align:middle;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;margin-left:-60px;padding-left:55px;padding-right:80px;box-sizing:border-box;word-wrap:break-word;-webkit-hyphens:auto;-ms-hyphens:auto;hyphens:auto}.ct_mpda_btn_more{position:absolute;right:10px;top:50%;transform:translateY(-50%);-webkit-transform:translateY(-50%);display:inline-block;color:#576b95;font-size:13px;border:1px solid #576b95;border-radius:3px;line-height:2.2;padding:0 .75em}.ct_mpda_btn_more:active{border-color:#354567;color:#354567;-webkit-tap-highlight-color:rgba(0,0,0,0)}.ct_mpda_title{font-size:14px;-webkit-tap-highlight-color:rgba(0,0,0,0);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.ct_mpda_details{display:inline-block;vertical-align:top;font-size:13px;color:#878787;-webkit-tap-highlight-color:rgba(0,0,0,0)}.ct_mpda_details:after{content:'';display:inline-block;width:4px;height:4px;border-width:0 1px 1px 0;border-style:solid;border-color:#878787;-webkit-transform:rotate(45deg) translateY(-3px);transform:rotate(45deg) translateY(-4px);margin-left:3px}.ct_mpda_btn_about{display:none;font-size:13px;line-height:2.8;padding:0 1em;background:#fff;color:#576b95;border:1px solid #dfdfdf;box-shadow:0 1px 3px 0 rgba(0,0,0,0.1);border-radius:3px;position:absolute;bottom:-28px;left:55px;z-index:9;-webkit-tap-highlight-color:rgba(0,0,0,0)}.ct_mpda_btn_about:active{background-color:#ececec}.db{display:block}.qqmusic_area{display:block;margin:17px 1px 16px 0;font-weight:400;text-decoration:none;font-size:0;line-height:0;text-align:left;-ms-text-size-adjust:none;-webkit-text-size-adjust:none;text-size-adjust:none}.qqmusic_area .unsupport_tips{display:none;padding:20px 20px 8px;line-height:1.6;font-size:16px}.qqmusic_area .pic_qqmusic_default{position:absolute;top:50%;left:50%;margin-top:-18.5px;margin-left:-18.5px;width:37px;height:37px;display:none}.qqmusic_area.unsupport .unsupport_tips{display:block}.qqmusic_area.unsupport .pic_qqmusic_default{display:inline-block}.qqmusic_area.unsupport .icon_qqmusic_switch{display:none}.qqmusic_wrp{border:1px solid #ebebeb;line-height:1.6}.qqmusic_bd{position:relative;background-color:#fcfcfc;overflow:hidden}.qqmusic_ft{text-align:right;background-color:#f5f5f5;border-top:1px solid #ebebeb;line-height:2.5;overflow:hidden;font-size:11px;padding:0 .5em}.play_area{float:left;width:60px;height:60px;margin-right:12px;position:relative}.qqmusic_thumb{display:block;width:60px;height:60px!important}.access_area{display:block;color:#8c8c8c;min-height:60px;overflow:hidden;margin-right:10px;-webkit-tap-highlight-color:rgba(0,0,0,0);outline:0}.qqmusic_songname,.qqmusic_singername{display:block;width:auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal}.qqmusic_songname{padding:7px 0 3px;margin-bottom:-4px;font-size:16px;color:#3e3e3e}.qqmusic_singername{font-size:14px;margin-right:20px}.qqmusic_source{position:absolute;right:6px;bottom:6px}.qqmusic_source img{width:13px;height:13px;vertical-align:top;border:0}.qqmusic_love{position:relative;float:right;margin:10px 0 0 10px;height:54px;color:#607fa6;width:53px;text-align:center;font-size:13px;background:transparent url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/appmsg\/qqmusic\/icon_qqmusic_play_sprite.2x26f1f1.png) no-repeat 0 0}.qqmusic_love:before{content:\" \";position:absolute;left:0;top:0;width:1px;bottom:0;border-left:1px solid #e7e6e4;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleX(0.5);transform:scaleX(0.5)}.qqmusic_love .icon_love{margin-top:16px}.qqmusic_love .love_num{display:block}.icon_qqmusic_switch{position:absolute;top:50%;left:50%;margin-top:-18.5px;margin-left:-18.5px;line-height:200px;overflow:hidden;cursor:pointer;width:37px;height:37px;-webkit-tap-highlight-color:rgba(0,0,0,0);outline:0;background:transparent url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/appmsg\/qqmusic\/icon_qqmusic_play_sprite.2x26f1f1.png) no-repeat 0 0;-webkit-background-size:37px auto;background-size:37px auto}.qqmusic_playing .icon_qqmusic_switch{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/appmsg\/qqmusic\/icon_qqmusic_play_sprite.2x26f1f1.png);background-position:0 -42px}.icon_love{width:12px;height:12px;vertical-align:middle;display:inline-block;margin-top:-0.2em;background:transparent url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/appmsg\/qqmusic\/icon_love_mini_sprite.2x25decf.png) no-repeat 0 0;-webkit-background-size:12px auto;background-size:12px auto}.loved .icon_love{background-image:url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/appmsg\/qqmusic\/icon_love_mini_sprite.2x25decf.png);background-position:0 -17px}.db{display:block}.icon_share_audio_switch{background:transparent url(data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAMAAAArteDzAAAAaVBMVEUAAAAarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRlIa6J1AAAAInRSTlMA9wYa38QR7ZJnMK1IIqBsO3fXDbSGQudZz5fKpV0rfbpRlHIjYQAAA35JREFUWMPFWduyqjAMDS0tgtwEFBGv\/P9Hntmh3cWDTYsMs\/Oio3SRy0qapuCU7PXIRdUGQxCFncgfrwzWCb\/l4TCTML\/xbxFlIQariEJ+AZnkwUBKkCdLIZvBQ5olsPw61Uhc4vTOa4Ca39P4IqYWXH2dyw5mWXUs2ez\/8liZVx6YD2bW6wXRzmpesov0U70HxW5azTBmpD1xqJW9uUzfaS0Lp1ms0Nru6Nfv9WPSi8lahT2BKoWyvARPKZUPhLRiduq9ckHaKds6y5pa6XmARXJQutaEP4MzLJTzyJfmk193I2YKiyUdUXcf+OnCdKPO+JqNvxO2kx4YNcr+c2jvjpE7Wv27W4uRS\/C1jFEu3mpdhJyX34PWISY3ByNj\/SxhhZRjfZ0UMkUJt3Bxx08rJU2xbFB16YEZDiG3JSy6sHlXNPbCHIbOVpHiN1VzjBLzKOCkmxjGKld6B4oNbjkiqi3rkJeBNN8jBj7SUEaxyGgnjE1OkS0mHkUAgd5X\/qWF80mWR7PaOY0410GrnHHXVHpSqlZII521RzeXqtpkTkgEEitIiwF1YeLDJgQnIldbgAx5wMBj5z4br+aWB5GdGbxUxGjUp6ESLmxhJsaMFzx+Pi5+VIpN6bTUlcvPfw\/InXlvjO5MjsdE\/ucg6DjxRlEJY4Wb0J1IlnR0ZoXGEHF\/6l1I68d+vj3ho9xH0mO+cjumNiMxvg\/tTOWYcIAkqCl+XjRbtH7CHv4aCQrIQIui3TCxNPyN1BMXfhQFFxCgJ\/yzmYAaTpGgEZpPoOq60GJctfkRaX5IBApRVTNTm\/TvnYHqCEoh6kMzUCuNxnUUpVzkB\/2+\/Pc5iTpT5PdNUx78FrMT6kymqbugmEpxNZU4JXaph7v0GbOGxJQ3SZU+ryINSWT8iAt6skg7txPD1wCJN\/rrQG0nZuNzo54nHQOnNj6zRTtRj5Pe5klu0d7NBGTThvFENhNE20NQS5BtD9GgUdQqyQZtaSuZ4bIr1fUGcmHTCz1SRpJNL9GeE3xNHe35\/CDhRj04DhLzI48b9eI48mxxONvyGLn+wGtsLTY5mm87RFg\/7jhNxh3bD2aANWtHSFsOu7Yfy60fIG4\/6lw\/lN14fOwedJdWXxKD7m1H8u7LAwZMZsn88mCDa46\/v5DZ6OoIhcf7dg7Y7mPalb7XcVEwDEFU+V3H\/QOplcP+ctPpgwAAAABJRU5ErkJggg==) no-repeat 0 0;width:42px;height:42px;vertical-align:middle;display:inline-block;-webkit-background-size:42px auto;background-size:42px auto;overflow:hidden;color:transparent}.icon_share_audio_switch:before{content:\"\u64ad\u653e\u8bed\u97f3\"}.icon_share_audio_switch_accessibility{position:absolute;width:20px;height:20px;left:-9999em}.icon_share_audio_switch_accessibility:before{content:\"\u505c\u6b62\u64ad\u653e\"}.share_audio_playing .icon_share_audio_switch{background-image:url(data:image\/gif;base64,R0lGODlhVABUAPfJAButGiKwIe747m7Kbe\/47\/r8+vj7+J3bnB+vHqDcny20LByuG+j16Pz9\/HvPeiOwIk\/ATuT05FLBUTa3Np7bnTm4OCqzKdXv1ff79ySwI8Lowi+1Lj66Pb3mvdvx23nPeaTepMjqyLXktVzEW63hrTW2NEu+So7WjdLu0j66PrzmvKrgqn7QfeL04p\/cnkm+SCiyJ7\/nvmTHYyGwIPn8+fX69d7y3vb69iWxJE2\/TPL58iuzKqzgrHjOeEW8RPT69PH58ZXYlNDtz4bThSyzK+337eb15mLGYdbv1mnJaW\/Lb8bqxja3NeX15V3FXPD48GHGYfP689fw11HAUHzQe3fOd0q+STi4N8rrytPu01\/FXz25PGzKa17FXez37CCvH6ngqaDcoOn26ODz3x6vHZLXkiaxJef150y\/S+Hz4NDt0E\/AT77nvrTjtJfZlnrPeje3N0K7QWvKaoXThLvmu8fqxmXHZIPSg5bZlavgq8\/tz9zx3JzbnI\/WjtHu0Ue9RkS8Q93y3ZTYk6LdovH58FfDV2DGYInUiX3QfIfThmfIZtnw2Dq4OZDXkLrlulDAUIzVi43VjG\/LbsPpw\/n7+XTNc1TBUx6uHcDnv3DLcDG1MN\/y31\/FXsjqx2jJaFPBUi60LS60LljDWHXNdGbIZTS2M6\/hrnfOdke9R9Tv1FbCVWPHYkC6P1rEWbDir0a8RVXCVMnryYvVi4jUiMHowVnDWMvry+v36zO2Mqjfpx2uHGfIZyeyJsDowLHisZHXkZPYk7nluXbNddnw2fv8+4fUhzC1LxqtGf39\/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH\/C05FVFNDQVBFMi4wAwEAAAAh\/wtYTVAgRGF0YVhNUDw\/eHBhY2tldCBiZWdpbj0i77u\/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4NzEyYzBkMi03NGJlLTQ5MTEtYmQyMi1lNmI4ZTlhZmQ5ZGIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkUzMTAyRkEyMjg0MTFFN0JDNzBCMEY5NjNCMDhDQjQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkUzMTAyRjkyMjg0MTFFN0JDNzBCMEY5NjNCMDhDQjQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NzEyYzBkMi03NGJlLTQ5MTEtYmQyMi1lNmI4ZTlhZmQ5ZGIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODcxMmMwZDItNzRiZS00OTExLWJkMjItZTZiOGU5YWZkOWRiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af\/+\/fz7+vn49\/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M\/OzczLysnIx8bFxMPCwcC\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)}.share_audio_playing .icon_share_audio_switch:before{content:\"\u505c\u6b62\u64ad\u653e\"}.share_audio_playing .icon_share_audio_switch_accessibility:before{content:\"\u505c\u6b62\u64ad\u653e\"}.share_audio_context{background-color:#fcfcfc;padding:14px 15px 6px;font-size:16px;position:relative;outline:0;-webkit-tap-highlight-color:rgba(0,0,0,0)}.share_audio_context:before{content:\" \";position:absolute;top:0;left:0;border:1px solid #e0e0e0;border-radius:4px;-moz-border-radius:4px;-webkit-border-radius:4px;width:200%;height:200%;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-webkit-transform:scale(0.5);transform:scale(0.5);-webkit-transform-origin:0 0;transform-origin:0 0}.share_audio_switch{margin:-10px 15px 0 0;position:relative;z-index:1}.share_audio_info{position:relative;z-index:1;outline:0;-webkit-tap-highlight-color:rgba(0,0,0,0)}.share_audio_title{display:block;font-weight:400;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;min-height:1.6em}.share_audio_tips{overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;padding-bottom:6px;font-size:12px;color:#8c8c8c}.share_audio_progress_wrp{height:2px;margin-right:7px;position:relative;outline:0;-webkit-tap-highlight-color:rgba(0,0,0,0)}.share_audio_progress{height:100%;background-color:#ebebeb;position:relative;width:100%;padding-left:7px;-webkit-box-sizing:initial!important;box-sizing:initial!important}.share_audio_progress_inner{background-color:#09bb07;height:100%;position:absolute;top:0;left:0;z-index:1}.share_audio_progress_buffer{position:absolute;top:0;left:0;bottom:0;background-color:#d9d9d9}@-webkit-keyframes slidein{from{-webkit-transform:translateX(-50%);transform:translateX(-50%)}to{-webkit-transform:translateX(0);transform:translateX(0)}}@keyframes slidein{from{-webkit-transform:translateX(-50%);transform:translateX(-50%)}to{-webkit-transform:translateX(0);transform:translateX(0)}}.share_audio_progress_loading{position:absolute;top:0;bottom:0;left:0;right:0;overflow:hidden;display:none}.share_audio_progress_loading .share_audio_progress_loading_inner{position:absolute;top:0;bottom:0;left:0;-webkit-animation:slidein 6s linear infinite normal;animation:slidein 6s linear infinite normal;width:200%;max-width:none!important;background-image:-webkit-repeating-linear-gradient(-15deg,#d9d9d9,#d9d9d9 2px,#ebebeb 2px,#ebebeb 4px);background-image:repeating-linear-gradient(-15deg,#d9d9d9,#d9d9d9 2px,#ebebeb 2px,#ebebeb 4px)}.share_audio_progress_handle{z-index:2;position:absolute;width:14px;height:14px;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;background-color:rgba(9,187,7,0.15);top:50%;margin-top:-7px;margin-left:-3.5px;cursor:pointer;outline:0;-webkit-tap-highlight-color:rgba(0,0,0,0)}.share_audio_progress_handle:before{content:\" \";width:8px;height:8px;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;background-color:#09bb07;position:absolute;left:50%;top:50%;margin-top:-4px;margin-left:-4px}.share_audio_desc{color:#b2b2b2;overflow:hidden;padding-top:6px;font-size:12px}.share_audio_desc em{font-weight:400;font-style:normal}.share_audio_length_current{float:left}.share_audio_length_total{float:right}.share_audio_length_total:before{position:absolute;left:-9999em;content:\"\u603b\u65f6\u957f\"}.topic_area{display:block;margin:17px 1px 16px 0;font-weight:400;text-decoration:none;font-size:0;line-height:0;text-align:left;-ms-text-size-adjust:none;-webkit-text-size-adjust:none;text-size-adjust:none}.topic_area .unsupport_tips{display:none;padding:20px 20px 8px;line-height:1.6;font-size:16px}.topic_area.unsupport .unsupport_tips{display:block}.topic_wrp{border:1px solid #ebebeb;line-height:1.6;background-color:#fcfcfc;border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px;overflow:hidden;padding:8px 10px;display:block}.topic_thumb{float:left;width:75px;height:100px;margin-right:20px;background-repeat:no-repeat;background-position:50% 50%;-webkit-background-size:cover;background-size:cover}.topic_content{position:relative;display:block;overflow:hidden;height:100px}.topic_title{font-weight:400;font-size:16px;color:#3e3e3e}.topic_desc{color:#8c8c8c;font-size:14px}.topic_title,.topic_desc{display:block;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1}.topic_info{position:absolute;bottom:0;left:0;right:0;color:#8c8c8c}.topic_info_primary{float:left;margin-right:.5em;font-size:14px}.topic_info_extra{float:right;margin-left:.5em;font-size:14px}.icon_topic{background:transparent url(\/mmbizwap\/en_US\/htmledition\/images\/icon\/appmsg\/topic\/icon_topic.2x2e4988.png) no-repeat 0 0;width:10px;height:11px;vertical-align:middle;display:inline-block;-webkit-background-size:100% auto;background-size:100% auto;margin:-2px 5px 0 0}.iframe_full_video{position:fixed!important;left:0;right:0;top:0;bottom:0;z-index:1000;background-color:#000;margin-top:0!important}.video_iframe{display:block}.video_ad_iframe{border:0;position:absolute;left:0;top:0;z-index:100;width:100%;height:100%;background-color:#fff}@media screen and (device-aspect-ratio:2\/3),screen and (device-aspect-ratio:40\/71){.meta_original_tag{padding-top:0}}@media(min-device-width:375px) and (max-device-width:667px) and (-webkit-min-device-pixel-ratio:2){.mm_appmsg .rich_media_inner,.mm_appmsg .rich_media_meta,.mm_appmsg .discuss_list,.mm_appmsg .rich_media_extra,.mm_appmsg .title_tips .tips{font-size:17px}.mm_appmsg .meta_original_tag{font-size:15px}}@media(min-device-width:414px) and (max-device-width:736px) and (-webkit-min-device-pixel-ratio:3){.mm_appmsg .rich_media_title{font-size:25px}}@media screen and (min-width:1024px){.rich_media{width:740px;margin-left:auto;margin-right:auto}.rich_media_inner{padding:20px}body{background-color:#fff}}@media screen and (min-width:1025px){body{font-family:\"Helvetica Neue\",Helvetica,\"Hiragino Sans GB\",\"Microsoft YaHei\",Arial,sans-serif}.rich_media{position:relative}.rich_media_inner{background-color:#fff;padding-bottom:100px}}@media screen and (min-width:1024px){.rich_media_meta{max-width:none}a.rich_media_meta_nickname{display:inline-block!important}span.rich_media_meta_nickname{display:none!important}.rich_media_content{min-height:350px}.rich_media_title{padding-bottom:10px;margin-bottom:14px;border-bottom:1px solid #e7e7eb}.discuss_container.access{width:740px;margin-left:auto;margin-right:auto;background-color:#fff}.discuss_container.editing .frm_textarea_box{margin:0}.frm_textarea_box{position:relative}.frm_textarea_box:before{content:\" \";position:absolute;left:0;top:0;width:1px;height:100%;border-left:1px solid #e7e6e4;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleX(0.5);transform:scaleX(0.5)}.frm_textarea_box:after{content:\" \";position:absolute;left:0;top:0;width:1px;height:100%;border-left:1px solid #e7e6e4;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleX(0.5);transform:scaleX(0.5);left:auto;right:-2px}.rich_media_meta.nickname{max-width:none}.rich_tips.with_line .tips{background-color:#fff}}.text_unselecet{-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;user-select:none}.pay_reading_area{padding:60px 8px 30px;-webkit-box-sizing:border-box;box-sizing:border-box;margin:0 auto}.pay_tit_tips_wrp{position:relative}.pay_tit_tips_wrp:before{content:\" \";position:absolute;left:0;top:0;right:0;height:1px;border-top:1px solid #e0e0e0;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleY(0.5);transform:scaleY(0.5)}.pay_tit_tips{position:relative;top:-0.75em;padding:0 .5em;background-color:#fff;color:#8c8c8c}.pay_tit_sub_tips{word-wrap:break-word;word-break:break-all;margin:-12px 0 10px}.btn_pay_reading{width:180px;height:35px;line-height:35px;text-align:center;border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px;color:#0aba07;border:1px solid #0aba07;margin:5px 0 14px 0;display:inline-block}.btn_pay_reading.disabled{border-color:#d5d6d7;color:#c4c2c5;background-color:#fbfbfd}.pay_tips{font-size:14px}.pop_tips .inner{width:280px;box-sizing:border-box;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;font-size:14px;background-color:#f7f7f9;position:fixed;left:50%;top:28%;margin-left:-140px;z-index:20}.pop_tips .inner .tips_title{font-size:16px;display:block;vertical-align:middle;max-width:98%;padding:15px 10px 0;color:#3e3e3e;text-align:center}.pop_tips .inner .tips_con{color:#888;font-size:14px;padding:10px 15px}.pop_tips .inner .tips_opr{line-height:50px;font-size:18px}.pop_tips .inner .tips_opr .ft_btn{position:relative;width:280px;display:block;text-align:center;color:#0aba07}.pop_tips .inner .tips_opr .ft_btn:before{content:\" \";position:absolute;top:0;right:0;height:1px;border-top:1px solid #ececec;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleY(0.5);transform:scaleY(0.5);left:0}.pop_tips .mask{width:100%;height:100%;position:fixed;left:0;top:0;background-color:rgba(0,0,0,0.4);z-index:1}.wx_poptips_wrp.pay_reading{top:50%;margin-top:-60px}.wx_poptips_wrp.pay_reading .toast_content{margin-top:75px}.weui_loading{width:20px;height:20px;display:inline-block;vertical-align:middle;-webkit-animation:weuiLoading 1s steps(12,end) infinite;animation:weuiLoading 1s steps(12,end) infinite;background:transparent url(data:image\/svg+xml;base64,PHN2ZyBjbGFzcz0iciIgd2lkdGg9JzEyMHB4JyBoZWlnaHQ9JzEyMHB4JyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJub25lIiBjbGFzcz0iYmsiPjwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjRTlFOUU5JwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoMCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICA8L3JlY3Q+CiAgICA8cmVjdCB4PSc0Ni41JyB5PSc0MCcgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHJ4PSc1JyByeT0nNScgZmlsbD0nIzk4OTY5NycKICAgICAgICAgIHRyYW5zZm9ybT0ncm90YXRlKDMwIDUwIDUwKSB0cmFuc2xhdGUoMCAtMzApJz4KICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyM5Qjk5OUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz4KICAgIDwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjQTNBMUEyJwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoOTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNBQkE5QUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxMjAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCMkIyQjInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxNTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCQUI4QjknCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxODAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDMkMwQzEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyMTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDQkNCQ0InCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEMkQyRDInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEQURBREEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNFMkUyRTInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0Pgo8L3N2Zz4=) no-repeat;-webkit-background-size:100%;background-size:100%}@-webkit-keyframes weuiLoading{0%{-webkit-transform:rotate3d(0,0,1,0deg)}100%{-webkit-transform:rotate3d(0,0,1,360deg)}}@keyframes weuiLoading{0%{-webkit-transform:rotate3d(0,0,1,0deg)}100%{-webkit-transform:rotate3d(0,0,1,360deg)}}.load_img_wrp{display:inline-block;font-size:0;position:relative;font-weight:400;font-style:normal;text-indent:0;text-shadow:none 1px 1px rgba(0,0,0,0.5)}.load_img_wrp img{vertical-align:top}.base_loading_opr{position:absolute;top:50%;left:50%;margin-top:-15px;margin-left:-15px}.weui_loading.base_img_loading{width:30px;height:30px}.base_reload_opr{display:block;position:absolute;top:50%;left:50%;text-align:center;margin-top:-32px;margin-left:-28px}.base_reload_opr .base_img_reload{display:inline-block;width:40px;height:40px;background-image:url('data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAABSCAMAAADw8nOpAAAArlBMVEUAAAAAAAD\/\/\/9paWkyMjL\/\/\/\/\/\/\/\/\/\/\/\/29vb\/\/\/\/09PTn5+fh4eGvr6\/\/\/\/\/6+vqZmZm8vLz39\/fj4+P8\/PyBgYH\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/Gxsb\/\/\/\/\/\/\/\/\/\/\/\/v7+\/MzMzr6+v\/\/\/+4uLj\/\/\/\/o6OhNTU3Y2NjQ0ND9\/f35+fn\/\/\/\/\/\/\/\/\/\/\/\/t7e3\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/z8\/Pb29v\/\/\/\/y8vLw8PDU1NT\/\/\/\/\/\/\/\/ym0LiAAAAOXRSTlMaAPooH+3z2LwFtYZ5QvXUNkvDgOAul49vV1RHGRKfWZThSPiMI2pf6szLva2ahHhPQa9wIamkYyJOAjtMAAAD1ElEQVRYw8WZ6XbaMBBGp\/K+L4DBxUDZQkjInpB+7\/9ipSapQPKGOT69PxNzbY3Go5FMP2rIxqPkPphrjGnz4D4ZjbO6X1QqJ2liQMJI0kk7pfW8YwD0eOrOvFBRVSX0Zu401gGw3bN1sXLyqAEsdiKSiJyYAdrj5CJlNvSBoDegEga9APCHWWOl9eQDZkSVRCbgP1nNlC8GYHtUi2cDxksDpTUEjJ\/UiJ8GMLTqlO93YI5KDVEdhrv3auVYR39BF7DoQx9XKVMGW6GLUGywtFw5An7RxfwCRpKSG3vUgh53CsoUeKNWvAFpkXLM+DNe\/pxsLCvfdR7HNvHU30WldQebill\/Pph9ben3t\/b0piwfbNxZgnKIfuHVA9dc4gS2dcLCXOpjeK58AVsUCacMEuyjSLpgeDlVWgacghGvdHDqpA4M60T5BEOVi8ItStE28vtu4IkrMx9y7XEZvvBN5+2nF0Yb94Pf5UGVHgF+9k85lGdb3eMIe\/1cE8f79R2MrSLP+vBbOfEhVVwTR2wpaoqjISdeizUZ\/uRL+QiTBKbIMaLCxPq6n6lKz\/F4VFoaIjGOX78pS2z3mKuv4noEzcqVzwjEQLPjDFAps6PzRvhzgOdcuRPLhToXjTKb\/K63ilg+dn+VE8YGYtLmo6ZKboqGPmBsclCmiIUp1QCIr7zMBw6I+RwjPSgT8V184NdWoeThscUBJgelIcy3suTDruQTB4SgRTB+UAa9KEge1dPHgRWdoSOjsRjKVz6eGtx80sVgjmmE6XkG6Tzhaljnl4bCazeiBO55EucRatYfmPLdXSR0jxmdssorQsOFUX4jZrinAJ4UyqZr5SIvckI1CmguBCPAAbfZ1HD07+cKMScNipwZm1plqIFzksYKNGI4r3r5UhBRLTOcMP\/3WCpYsXJB9TjcuFzQibLlwPlaIoRegdZmeniDceTjNMaYFyfRiprg+bkxWAtJVJjqduO+EtBCIdWLX0hfbebcS3F3kZSUjU0zpbrFisSyUVLc9tTQuSCpuJWUYH9A7dCRlS0U+3bGCEbpcsa8VkoHSfmiG7dSxkgrWoPpRS7eGlQ1MG6b\/c+uss1iFWsaH5fYZtU0g6XrxUzj\/xKawbqW1Sx+mhX4dlNoWesba321lvvAIA8Lb5qExrq2\/b\/thee7vy2O2FTa\/tdvUoLVzFMOdwkjvvvjcRY2KRdspZZ6g63UFRu+fc2Gr4NtaQeb5w62+B0cRHR0XHL9oU73R0\/XH5B1c4zX\/WEj5\/f1R6LdH9xef7x8\/SF410f1139Q+P+fPa74ONPBJ6Q\/+TfzjGYmPq8AAAAASUVORK5CYII=');background-size:cover;background-repeat:no-repeat}.base_reload_opr .desc{font-size:14px;color:#888;margin-top:10px}.bg_gray_wrp{position:absolute;top:0;left:0;right:0;bottom:0;background-color:#eeedeb}.gif_img_wrp{display:inline-block;font-size:0;position:relative;font-weight:400;font-style:normal;text-indent:0;text-shadow:none 1px 1px rgba(0,0,0,0.5)}.gif_img_wrp img{vertical-align:top}.gif_img_tips{background:rgba(0,0,0,0.6)!important;filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='#99000000',endcolorstr = '#99000000');border-top-left-radius:1.2em 50%;-moz-border-radius-topleft:1.2em 50%;-webkit-border-top-left-radius:1.2em 50%;border-top-right-radius:1.2em 50%;-moz-border-radius-topright:1.2em 50%;-webkit-border-top-right-radius:1.2em 50%;border-bottom-left-radius:1.2em 50%;-moz-border-radius-bottomleft:1.2em 50%;-webkit-border-bottom-left-radius:1.2em 50%;border-bottom-right-radius:1.2em 50%;-moz-border-radius-bottomright:1.2em 50%;-webkit-border-bottom-right-radius:1.2em 50%;line-height:2.3;font-size:11px;color:#fff;text-align:center;position:absolute;bottom:10px;left:10px;min-width:65px}.gif_img_tips.loading{min-width:75px}.gif_img_tips i{vertical-align:middle;margin:-0.2em .73em 0 -2px}.gif_img_play_arrow{display:inline-block;width:0;height:0;border-width:8px;border-style:dashed;border-color:transparent;border-right-width:0;border-left-color:#fff;border-left-style:solid;border-width:5px 0 5px 8px}.gif_img_loading{width:14px;height:14px}i.gif_img_loading{margin-left:-4px}.gif_bg_tips_wrp{position:relative;height:0;line-height:0;margin:0;padding:0}.gif_bg_tips_wrp .gif_img_tips_group{position:absolute;top:0;left:0;z-index:9999}.gif_bg_tips_wrp .gif_img_tips_group .gif_img_tips{top:0;left:0;bottom:auto}.flex_context{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.flex_bd{-webkit-box-flex:1;-webkit-flex:1;flex:1;word-wrap:break-word;word-break:break-all}.weapp_card{border:1px solid #e1e1e1;background-color:#fdfdfd;color:#3e3e3e;line-height:1.6;font-size:16px;font-weight:400;font-style:normal;text-indent:0;text-align:left;text-decoration:none}.weapp_card.flex_context{padding:12px 15px}.weapp_card.flex_context .weapp_card_hd{padding-right:1em}.weapp_card.flex_context .weapp_card_avatar{width:50px;height:50px}.weapp_card.flex_context .weapp_card_nickname{font-size:17px;font-weight:400;display:block;width:auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal}.weapp_card.app_context{padding-top:10px;border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px;overflow:hidden}.weapp_card.app_context .weapp_card_bd{padding:0 15px 15px}.weapp_card.app_context .weapp_card_profile{font-size:12px;color:#8c8c8c}.weapp_card.app_context .weapp_card_avatar{width:20px;height:20px;margin:-0.2em 5px 0 0}.weapp_card.app_context .weapp_card_nickname{overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;font-weight:400}.weapp_card.app_context .weapp_card_title{padding:.3em 0 .75em;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;font-weight:400}.weapp_card.app_context .weapp_card_thumb_wrp{position:relative;display:block;padding-bottom:80%;overflow:hidden;background-repeat:no-repeat;background-position:center center;-webkit-background-size:cover;background-size:cover}.weapp_card.app_context .weapp_card_thumb{position:absolute;top:0;left:0;width:100%;height:100%!important}.weapp_card.app_context .weapp_card_ft{padding:0 15px;border-top:1px solid #e1e1e1;line-height:1.56em}.weapp_card.app_context,.weapp_card .weapp_card_bd,.weapp_card .weapp_card_ft,.weapp_card .weapp_card_nickname,.weapp_card .weapp_card_info,.weapp_card .weapp_card_title{display:block}.weapp_card_avatar{padding:0}.weapp_card_logo{color:#8c8c8c;font-size:13px}.icon_weapp_logo_mini{width:14px;height:14px;vertical-align:middle;margin-right:.2em;margin-top:-0.2em}.img_loadederror{background-color:#eeedeb;border:1px solid #eeedeb;background-image:url('data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAABSCAMAAADw8nOpAAAArlBMVEUAAAAAAAD\/\/\/9paWkyMjL\/\/\/\/\/\/\/\/\/\/\/\/29vb\/\/\/\/09PTn5+fh4eGvr6\/\/\/\/\/6+vqZmZm8vLz39\/fj4+P8\/PyBgYH\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/Gxsb\/\/\/\/\/\/\/\/\/\/\/\/v7+\/MzMzr6+v\/\/\/+4uLj\/\/\/\/o6OhNTU3Y2NjQ0ND9\/f35+fn\/\/\/\/\/\/\/\/\/\/\/\/t7e3\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/z8\/Pb29v\/\/\/\/y8vLw8PDU1NT\/\/\/\/\/\/\/\/ym0LiAAAAOXRSTlMaAPooH+3z2LwFtYZ5QvXUNkvDgOAul49vV1RHGRKfWZThSPiMI2pf6szLva2ahHhPQa9wIamkYyJOAjtMAAAD1ElEQVRYw8WZ6XbaMBBGp\/K+L4DBxUDZQkjInpB+7\/9ipSapQPKGOT69PxNzbY3Go5FMP2rIxqPkPphrjGnz4D4ZjbO6X1QqJ2liQMJI0kk7pfW8YwD0eOrOvFBRVSX0Zu401gGw3bN1sXLyqAEsdiKSiJyYAdrj5CJlNvSBoDegEga9APCHWWOl9eQDZkSVRCbgP1nNlC8GYHtUi2cDxksDpTUEjJ\/UiJ8GMLTqlO93YI5KDVEdhrv3auVYR39BF7DoQx9XKVMGW6GLUGywtFw5An7RxfwCRpKSG3vUgh53CsoUeKNWvAFpkXLM+DNe\/pxsLCvfdR7HNvHU30WldQebill\/Pph9ben3t\/b0piwfbNxZgnKIfuHVA9dc4gS2dcLCXOpjeK58AVsUCacMEuyjSLpgeDlVWgacghGvdHDqpA4M60T5BEOVi8ItStE28vtu4IkrMx9y7XEZvvBN5+2nF0Yb94Pf5UGVHgF+9k85lGdb3eMIe\/1cE8f79R2MrSLP+vBbOfEhVVwTR2wpaoqjISdeizUZ\/uRL+QiTBKbIMaLCxPq6n6lKz\/F4VFoaIjGOX78pS2z3mKuv4noEzcqVzwjEQLPjDFAps6PzRvhzgOdcuRPLhToXjTKb\/K63ilg+dn+VE8YGYtLmo6ZKboqGPmBsclCmiIUp1QCIr7zMBw6I+RwjPSgT8V184NdWoeThscUBJgelIcy3suTDruQTB4SgRTB+UAa9KEge1dPHgRWdoSOjsRjKVz6eGtx80sVgjmmE6XkG6Tzhaljnl4bCazeiBO55EucRatYfmPLdXSR0jxmdssorQsOFUX4jZrinAJ4UyqZr5SIvckI1CmguBCPAAbfZ1HD07+cKMScNipwZm1plqIFzksYKNGI4r3r5UhBRLTOcMP\/3WCpYsXJB9TjcuFzQibLlwPlaIoRegdZmeniDceTjNMaYFyfRiprg+bkxWAtJVJjqduO+EtBCIdWLX0hfbebcS3F3kZSUjU0zpbrFisSyUVLc9tTQuSCpuJWUYH9A7dCRlS0U+3bGCEbpcsa8VkoHSfmiG7dSxkgrWoPpRS7eGlQ1MG6b\/c+uss1iFWsaH5fYZtU0g6XrxUzj\/xKawbqW1Sx+mhX4dlNoWesba321lvvAIA8Lb5qExrq2\/b\/thee7vy2O2FTa\/tdvUoLVzFMOdwkjvvvjcRY2KRdspZZ6g63UFRu+fc2Gr4NtaQeb5w62+B0cRHR0XHL9oU73R0\/XH5B1c4zX\/WEj5\/f1R6LdH9xef7x8\/SF410f1139Q+P+fPa74ONPBJ6Q\/+TfzjGYmPq8AAAAASUVORK5CYII=');background-size:40px;background-position:center center;background-repeat:no-repeat}.img_loading{background-color:#eeedeb;border:1px solid #eeedeb;background-size:22px;background-position:center center;background-repeat:no-repeat;background-image:url('data:image\/gif;base64,R0lGODlhPAA8APYAAJeXl56enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+\/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs\/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19nZ2dra2tvb29zc3N3d3eDg4OHh4ePj4wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkEAEIAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAPAA8AAAH\/oBCgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpuKJgwMJ5ycBQAABaKbBKUEqI9BQUCIA6UDhyELDRytg7BAQYezALWGCgEBDLuCvUCxhcHDhA4CAgELyULLzYTPhSAF0wMS10LMzL\/btIUNAdPW49nngtyDFQPTBBjjyuXaQqoArAYlmCYggr5B\/OIZKGVgUAR7Ak5x+tGjh49Dy+JdMGDgwiAG7Aoe8iBBwgdJPXio7PHDUK94hx5MU2CIQ4QEBw5MQKmyZw9DzBghOGDIggIESA+I49lT5cVLFhYgndpABCUfTVdagpBg6oEFFDClbPpzkoOpCBJMIKHJx1ge\/mUlPRiK4IEGVG6fUpowocPBv4ADCz7EIweOw4gR88BUIoOFx5AfY0jBKIeNy5gz58B0wcGDz6A\/O8hQObNpGzg4ew4N2sHdRTwSy8axAxMJDJEjX2gxuLfv35xu0KBhyYOHEqhsyIDBXAYlDRUoVNAwQpMOGsyzO58EvYJ3Cx1WXKIRIzvzGZY2WPDuHcPJSTmWm49RAxMIDOy9Z6Acacb8+oW0wNsiIljVzQX5+RUJdufdYAgLKaTwgiIjcMBBCIaUwMF6FCgICQ4z0JCaIS9EmIILg7xwwgkTCiKChRwgZ8gJHXAQCicrmNiiECgUiMIgGlroAWAlRsgCISYUe2gCISDAuKQ+MqgQoQoxIKkkISjUyEEHKujTgokoWinCk4NUaKGBycAgZQoq2FBIkmMW8oIHFnZAZitfRhimmHcKQgKMaOJp5CFw9ilICBtsECgqNLjQgpuGFHrICyKMcKRvkgKXyAkF3qjpITRESNynpJZq6qmopopKIAAh+QQJBABFACwAAAAAPAA8AIaVlZWbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6\/v7\/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8\/Q0NDR0dHS0tLT09PU1NTV1dXX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f398AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH\/oBFgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpuKKA4OKZycBwAAB6KbBaUFqI9EQ0NEhwSlBIchCw4drYNDQkJDs7WHCgEBDbyCvr\/BhbQAtoUPAtQMyUXLv7KEz9GDIgXUBBPX2L\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\/nDjSmAUQ61dFi\/axt1rwOiiHFWxXoVhA9OHCF\/Dgn3w4ITUx5AjY6rLwtKFCx9MuUhhonMKShIYLGAggWQmGitOdPYMeunSBhZMXGKBYnVnFZYmNHDN4AEGSjJq20bRApOGB7wZRBghaYXtE8ULlSjBSEO+QhkcuF5QQRKLzidUsC00AgQI2Yk4TJiQwdAHCrsXWJAUQ8UKGYdQmAdBXdAKESLgJsgG602QmSEiWECBCKCIYF4IKAwCAgYY7CSIBxSsN184+pnH3CAeZJCBB4RgUCCJ0qwQwoOfgSgiioKEkOEEFXw4DAn7oefiiIWot951vKSwIggixFBIiDwSTZJCBetRcOAsOJqn444wDtJBgUCqUsIHINhICJJVDpKBBBJsMEwLJZAw3pEvHpKCBhtMCRWYkiUiAoUM1nmICwDmpeefgAYq6KCEXhIIACH5BAkEAEYALAAAAAA8ADwAhpeXl5iYmJmZmZubm5ycnJ6enp+fn6CgoKGhoaOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+\/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs\/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3eDg4OHh4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf+gEaCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam4tCQpygQUBAQaCboqSmjz87O0CHqKWHREVFqoM7OTk7sKOyhUTBRLeCubo8hrGGwsHERj26OTqvhMrAzM5GxjnI1b6FRdjZPjrRPd6pg+HCttlGPNG8g9aCzMPuguW654L09qA7bNiQVwiaLoJDggQZMohZu0IZFCTQIOnGjIs2dBgy1g3RunuELCQQAADAAkk2Ll6kgcOQDo2LmhV6MCCATQAKJPGooXJly0sPCNgcWoADpRs0es6wYQmBgKEACDC41ANpzxqUDAwNIGABCE05eF7EOulAAAABDkwwpePGDUv+DBhYwEe3rt27h3TEgPGir18YMX5aCiHBQYPDiB1AMMEoBovHkCPDwPSggOXLmCM0jsyZxeRLDjCLLrB2UQ4YfP32Bfz2kgcIhhEfduAgBd7buHNzcszCkgULH0y9SFGiuO1JEhYoWBDBaKYaK0wUN04pwoLrCxhUOHGJxYnpxVVYmsAA+wIHFyjRQAG+xAkXmDI4ML8AAglJK8CbaGGoOCMNFEHUAHYKVIAfCSWYoEIMhozwwQfcJbKBBBJgYMgHFJSnwFyRyKDCCjIcgsKDH5QwyAohhLDCIBpQKEFwhohQAQUigBICiSgM8sEFF8BohAcTUGggXSM+OAIhHmCDgIEHhGDgIpPusADCgyCIN0gHSnZASAhBSkCBidmUQCJjhGCJgZaETEhhgMSkMOUHIYRYZpaFrFABhRP4qIqYD0Y455mGcOAim3t68MGRhpiJZiEYRBABocKZQIKchSh6iAoZbOAnXkkuqZsiIfAYwqeJvCCCCJ+RquqqrLbq6qugBAIAIfkECQQASQAsAAAAADwAPACGlZWVlpaWl5eXmJiYmZmZmpqam5ubnJycnZ2dnp6en5+foaGhoqKio6OjpKSkpaWlpqamp6enqKioqampqqqqq6urrKysra2trq6ur6+vsLCwsbGxsrKys7OztLS0tbW1tra2t7e3uLi4ubm5urq6u7u7vLy8vb29vr6+v7+\/wMDAwcHBwsLCw8PDxMTExcXFx8fHyMjIycnJysrKy8vLzMzMzc3Nzs7Oz8\/P0NDQ0dHR0tLS09PT1NTU1dXV1tbW19fX2NjY2dnZ2tra29vb3Nzc3d3d3t7e39\/fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB\/6ASYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbikVDQ0WcnEFAQEGim6SmqI9APDtCh6qnhkhHR0isgzw5OTuypbSFR0ZGR7qCvL08hrOGxMXHyD69OTqxhM6ESMXRyMnVzNnBw93S3z861T7jq4Pc3bnfgj3Vv4PagtDG84TqvT0GCSmFLck+I6J42LghrlC9ZYOICBFCZNC+c4Q4MFjAQdKNGSBt6DC0A6AiaBgFZVggAACABh5BgqSBg+Q9RcUMRSAQoCcABpJ61JA5s+alCAUA9Ox5AASlGzSIzrBhSYGApQAKPLjk4yPRGpQQLA0woMEITTqGggQ7KUEApf4JLKDaceOGJQcOMvTby7evX0Y7ZMSIAWNw4RgzRl4iMeEB3scOHkhIwUiGi8uYM8vAFMGA58+gJ1TOTNpFDEwQQKs2UAGwYMKGB8swaimEBMeQI0Ng8be379+6ZLRoYSkDBhGoYKgwwVwFJQoNGDSg8EGTDRYnmDenNKGB9wYOLji35AKFduYrLFVw8J0BBL2TaqQ4bwLFC0wcIHz3LuGEJBbnneCCISf4twgHHRWywQPtXSBJCyWYcAILmxViQgghUJaIBxRQoIEhIVjgAAMMYCDJDCywMMMhK2AYAgqDuDDCCAMKwsEEHYZwCAkYWFCCKCNgKEJ6goiQQQbICZECQgUdOshXixiaQAgIGmjg1CAadEiBjv28IIKQxA3yQZXVDTICkxRYYOA3J7iooZhkFtKBlgkiw8KXIYxAQyFjalDmIC1c0GEFSerSJoZvwumnIR\/Q+Q0KIIAgJaNxGqLBBBN08E0MKJywJ6WLGtICBx0k+heVVgK3CAlHkqCqIjKQQEKFr9Zq66245qprP4EAACH5BAkEAEEALAAAAAA8ADwAhpiYmKCgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+\/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs\/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2Nra2tvb29zc3N3d3d7e3t\/f3+Li4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf+gEGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam4o7OTk7nJw3NjY3opukNjiojzYzMqyGqqeGPzw8Pq2DMi8vMoe0hzw7Ozy7gr2+M7OltYQ9xcbIQTS+LzCyg8KEP9I7PdRByi\/MhNyDxMXH4jUw1zTnztDfuuLV1zHypoTq4PeD3vmKJwhHKW3R1oma0aKFuULWfAETpAMHDh3ppIU7BATIJBcpQraYSCjGMkXq2BXqyFJSi5AhVbwwFEPfIlyGWOqURGMFzJgzL+ncScmFip8pWFga2tJSjZc\/lU5i6lETDBYwpUpiikqGCxdLqwIcS7asWUMyTphYy3btCRj+mDIgIDCgrl0CBjwwQiGir9+\/JzAVAEC4sOEDjFL8XSwi8CUChiMDSMCIhtq2bYNasmCArt26BAiEOEu6tGlOfEdYcuDgAioTHzbI\/kApgYAAAhJQ0ORCBAfZskFQQiCguIABDYRbGtEBeHBLCgYYD1DgASUWHpxv6FACU4QCxosf4CAphHMOJAxtIL8IAgRDEAhMZyBJhIb1IVIY0lChgt5EEiCAgHWFWLDAAAEE0IAkKoQgggqHgNBfBewFMQIGGKgmSAQHCGjBIRo0sIAGolwwIW2CWNBAAx8KUkECAi5A1gcTkjgIBaztNogDAiJQAUAkWNCfBSIQgqMDOgprkgGMCChQITIcTNhBIUcmKYgEHSLwHjUgCFnBBRAamWMhIywgYAIt7hJlf\/+JiaQhE\/S4pZoUUGAjlWMa8sABB0RAzQnNhYnnm4aMAEEEKJJW5WmKYLAiBowmgkIGGegX6aWYZqrpppyiEggAIfkECQQARAAsAAAAADwAPACGlpaWm5ubnJycnZ2dnp6eoKCgoaGhoqKio6OjpKSkpaWlpqamp6enqKioqampqqqqq6urrKysra2trq6ur6+vsLCwsbGxsrKys7OztLS0tbW1tra2t7e3uLi4ubm5urq6u7u7vLy8vb29vr6+v7+\/wMDAwcHBwsLCw8PDxMTExcXFxsbGx8fHyMjIycnJysrKy8vLzMzMzc3Nzs7Oz8\/P0NDQ0dHR0tLS09PT1NTU1dXV1tbW2NjY2dnZ2tra29vb3Nzc3d3d39\/f4ODgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB\/6ARIKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbij07Oz2cnDk3Nzmim6SmqI85NDM6h6qnhkE9PkCsgzMwMDKypbSFPTw8PrqCvL01hrOGPsXGyEQ2Mb0xO4XOhLbRP9NEyjA02sGF0MXH4DjWvTeE24I\/0Ty54EQ1vb7w5oPExd\/uCWoHg5mgeOh4hOJUw4ULg4Xy9SIniEeOHDwGJQxYSIiQIUMkvUCRQoWLGYZkTFSEbiGhIR5jSnKRomZJGCl\/LerhclDMn5JqrLBZc0UMTDB\/eqz0YijRFpaUegxp6YYLFU8pSRWyKQYLmyy0\/qTKacaLF5ZAchXItq3bt\/6GaKRAcaKu3RModFraoMBAgb+ADSQIwUjFiMOIE6PAdACA48eQFRROTHnE4kuNIWtewMgGCrp37R69lCGBX8B\/DRwoAbe169ecVJAgYcmBgwyoUITgwJvwpAQCAghIUEETjBEdePemBFyA8wENRFwi4UH58koKBjgPXgACJRcfrHPwYAKThALbnR\/4IGmEdfKGOnRgFCGCoQgEtgdgIInEBg4diLCCIRtYYAF7iVCQQALeFYLBAgMEEEADkrAgAglhGRKCgRZ4MIgJGmhQniASILAgBodw0AADHIiCgYEX+EZEBg88gJsgFyiwIH9sbWjgBoRcAAEEFxDywIIJFH55jwkvWnABbYNYMKQFhGigYwILeAhOBxwiGOWUhUyApATgiHCBgRhARYiUEFBJSAkMLKgAishwaaCXX7ZpSAVI2oeMBxVU0KIhbLpZCAQIIEAmMil40IGahRR6SAkRTADCa0ISCZsiG9QI5KaIrLDBBhmCauqpqKaq6qqiBAIAIfkECQQARQAsAAAAADwAPACGmZmZmpqam5ubnJycnp6eoKCgoaGhoqKio6OjpKSkpaWlpqamp6enqKioqampqqqqq6urrKysra2trq6ur6+vsLCwsbGxsrKys7OztLS0tbW1tra2t7e3uLi4ubm5urq6u7u7vLy8vb29vr6+v7+\/wMDAwcHBwsLCw8PDxMTExcXFxsbGx8fHyMjIycnJysrKy8vLzMzMzc3Nzs7Oz8\/P0NDQ0dHR0tLS09PT1NTU1dXV1tbW19fX2NjY2dnZ2tra29vb3Nzc3d3d3t7e39\/fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB\/6ARYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbizk5nKA4NTU4oJs3ozemjzgyMZ+GqDWqhkA8PD+rgzEuLjGHsrSFOzo6PLqCvL0zsamGPcXGyEU0L70vOoXBhUHExT3TRTK9LjLazoQ80cfhNta9NYTbgz7ROrnh1OS\/g\/OC3jrA5RP0zgWNQaJIDYJWbAcoGi0MHqJBzpwgHjhwsCui7tshIkOGEJHkIoXJFhYJKWOWqKPDQiCFyBxC0qRJFS8MwYDBaMdLQkNkCqUZqcYKmzd5XgoqVOjISS5UIE3RwhLTpkQr2YiKlAWlqzOfYorBwqbXSVdDmprRy6rIgf5w48qdOxGFiRJ485YwkZLuIBQhAgsefMJvoRQgBis2YZhQDRN39eZV2riy5cuYi6QQMcJSAwYXTJ34oCGDhg+UDgQAEODABE0vRGzQQPt06gC4AwhYEOLSCA61aYOwhEBAbgAEGlBq4SG4Bg4lMEEgkBt3gQ6SQgTnQMLQhg2MIEAw9GDA8QWSRJjeACKFIQ0UKHhQJOHAAQeGLCgQAAAAA0krhCDCCoeAEN8EHAxCAgYYdCdIBAbYZ8EhGiyggAagXBBfBagJYgEDDEwoSAUI2KdAXAbGlwEhFDTQAAWEOGDfARUMRIIFG4pAyAQuvjZIBiUekAB24WwQHwVEDmLCYwM+DiJBhAeMNw0IFcR3AYE79lgICQrYh0BoyBgZ33yFLNmkkjNKqQsHE0yAoSFmHuKAAQZEMA0KHGyAZZlaGkICBBIMZ1iLL2ZmCAYgYmDoYRlkoMKikEYq6aSUVjpIIAAh+QQJBABGACwAAAAAPAA8AIaYmJiZmZmampqbm5udnZ2enp6fn5+goKChoaGioqKkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6\/v7\/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8\/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3g4ODh4eEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH\/oBGgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpuKPzg3PpycNjMzNqKbNaWnqI43MTA4h6ozNYdAOzs\/rYMwLCwvs6W2hjs5OTu8gr6\/MYa0xIQ8x8jKRjMtvy45hdCFQDrUPdZGzCzOhN6ExsfJ5DXZLC006cOEPtQ6oeRGMr\/AhEiZWkeNB79BLv7JGCSQlZFpx3SIkqFixUJD\/poN2mHDhjsj7HKMMxSk5BBJK0iUMKECHaEXvy4igvhx0JAgQHIGQVmi58oWhlwEW6RDYiGcOXVKooHCZ88TQC8JSZp0JyUWJ5yWUGEJKVUhl2qsMOE0BSWvOcFqepHCp9lJ\/l6DqOUU45clIXIP6t3Lt++hGWRJCB5c4oRLS0QSK17cyMSHx5Ajl8C0uHLiIoxORN78YfIly5YZ1SgxuPTKoZaKgFbst7Xr16JQhAhhiQGDC6hMdMBwAUMHSggCAAiAYIImFyAyYFjum9KBANADCFgA4pKIDcyXe7CUQEB0AAQaXOWQHcOGEZggEBge3cDvSCB6L9eAvpAGDYwcODD0YMD3BZLEh0EGH6BgCAYSSMCBIhEUYAADhliggAAAAABhJCp8AAJXhniQYAQbDDKCBRbUZ8QDDhpQwSEaLKBAiJxUkOAE2wlCgQIKUDAIBQcYYEACe3mYIG6DSLDAAhIQg8KAjwboyM8IFMxI2yARHBkBIRj0aAACC5KjQYISwEillYVAkOJ+1nwwQYIVrFBIlQtcScgICfh4wIrKfJlgl4TAKSchEjCJJi8aRBABBof4eUgDBRTwgDUnbJCBm4YoasgIDkDwwWtGIgmbIhfgSOSnh6RwwQUckqrqqqy26uqrogQCACH5BAkEAEoALAAAAAA8ADwAhpSUlJWVlZaWlpeXl5iYmJmZmZubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+\/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs\/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t\/f3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf+gEqCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam4pCOTlCnJw4NDQ4ops3pTeojzkzMjyHqjSshkM8PUGtgzIuLjGzq4c8Ojo9vIK+vzSGtLaEPcbHyUo1L78wsoTPhUM7xjs\/1UrLLs3cw9HTyOQ42C4vNum1hD\/TO0DkgjW\/wPTQlBQz5mPfIBj+agwiZWqQD3yiarBgga5Qv18zBvXAgaOdEmkEDxUZMqSIpBYlTJxgkbHQsoqHQG4jVERIkJtDJLEwwVPlC0Mxgi3iMXMQkZtIc0aykaInTxQwMBGxiTSIECOUXKBwamKFJapVlVbCweKEU6+TwOLEmimGip7+KiiBFUIE1YwWLSyRNGmwr9+\/gA3ZQGGW64kUMCklQcK4seNGKUJInkwZBSYkRzJr3oyEkQoQlEOfuLy59JHOi3CcKOz0sAxMi087bhy4tu3bolaMIGHJgQMMqFB80JBBAwhKCAIAEICggqYYIjZomG4ceYDrAQY0EHGJRAfqGjaEsKRAAHYABR5QeuEBvIYOJjBFKID9uoEPkkSA5xC\/EAcOjEAAgSEQEHAeA5KMUJx4aBGiAQUTeKCIBAYcoF4hGCwwAAAAOHBSCCLkZUgIFEDYwSAnZJBBf0pEUOEBFxzCQQMLAMjJBSVWcJwgFzTQQIyCWIDAAQcs4BeJJWqIQEgFvjk3iANEHmCBQSZYkCNvg1DgGwUODnmAAhKSw0GJFISZ5ZaFUEjkgNWEUEGJF4h4pgNcEmKCAkQmACQvY5aIXyFa0mnIBFGyyUsHE0ywwSGB1lnIAwYYEEE1KXTAgZyENHqICRBIMJ5tTDrgJG6IZOBjBqQmwsJ0mKbq6quwxirrrJsEAgAh+QQJBABEACwAAAAAPAA8AIaYmJiZmZmampqbm5ucnJydnZ2fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6\/v7\/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzOzs7Pz8\/Q0NDR0dHS0tLT09PV1dXW1tbX19fY2NjZ2dna2trb29vc3Nze3t7i4uIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH\/oBEgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpuKPDQ0PJycMy8vMqKbMqWnqI40LS02h6qmhzw3Nzqtgy0nKCyzq4c2nze7gi0oyi+GtKyEOJ80xscwKcoqsoTOhTw10jnHyMooLoXchDfS1OIz1ygpz0TogjnSNbrigjDkwIP0RIh9wqGPkAplKWAMIvVixqBon2qIguFLoSF+ylo8nDGDoCB1n8IZ8sGDxw9JKECEEHHCXCEWylwigqiNEEkdOENFOhGi50oVhlasYGSj5qAeOJPqhCSDhM+eI4Ze6rEjKc4dJyelGPFUhAlLVa3uWEppBgoRT79OCqsUiKYW\/iVCqCxBie0OH6hcpEhhqSTegoADCx68KAbXpz5JMLskJIjjx5CFMBqhYYPly5Y1iMAUBIjnz6CDMCJRGfNlzZxBqwYietEMtIihamQMuXYQyYRz697dqkQHD5aGCEc1IgOFCRQ0UBLOfIgmFh0qUJiefHnz4Zc8XEA+vcKG4NexS1KBgfr0CyEwhRcPiQN3ChZAGLJggdGCBYbWS+owYUIFDmoRUoEDDmSgSAMABIDAIdehxEEHKByyAYENXDBICP1tJsgCCQYQASLsaRIBgQ98J0gEBhjwoSAQCBBAAAUINiGBFBDyQIoPEHLAix4CFgIEJH5AiAMHHOCAgAO8bkiAgfpYQKADGBRCpJGFMNAhfuJw8ACBEfA1ZJFHEiJCAS8OIIE4ThLI5JdUSvkiAFjuckEDDVRwyJRhFpIAAHCKQ8IFFngpJZiHhKAAAxzwdqMBOfKmCAUp1uhoIihUUIGgk2aq6aacduqpPoEAACH5BAkEAEgALAAAAAA8ADwAhpaWlpeXl5iYmJmZmZqampubm52dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+\/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs\/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tzc3N3d3d\/f3+Dg4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf+gEiCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam4o\/NDQ\/nJwyLS0yopsxpTGojzUtLDeHMKUwhz43OD2tgywmJiuztYc2nzi8giwnyy6GtC22hTmfNLLIMCjLKceEz9GDPzWfNTrIycsnLYXehTjU1uYz2Scop4PsgzvUNTzmgy\/ogg1S1YLVoGKfcvgjlALdi0GkTA3SsU8UDBMnvhECuEydoBwyZCgU5C7hoSA+egSRhOIDiBAmmhVawUxRSRuGgPTYwdOHpBMggoIQkcKQChWMbOAs9IMHz56SZIwQGlQE0ktNn\/LkIYQSChFUQZSwtFMrD5+WaJwIQXXspLL+T30M0cSihFC3kuD2CCXqBQoUlnz4ALKwsOHDiBnJEME2bIgRGikVGSKksuXKQ4owGqGhs+fPIjANCUK6tOm5i0hk+Mw6BCYhpmMHQa1oRmPHIjxaInK5txDNiYMLH97KhAcPlo4YMYKKM4UJFDRQWk79iCYXHSpQ2E5hw3Tq1DF9uMB9u\/dK4KtTWpGhPIULri8pT89cUgfo2y2AMFTBAqMFCxhCX32QeABdBRyYYAgFDTSQgSINABBAAobMF14kKXDQQVGGbNAgAxcMEgIEEOwnCAMSBiDBIcsdYR0nEDTowHlIRGCAAREMEoEAAQRQwGEeNjgBIQ8ccMADhCCC0GMAOS4UwgMyIjeIA0Y6QEgFA\/RIgHT+WNBgAxgUQuUBVhISYY8BmsOBAw1CwOGUVRYiQgE9DjAkMhV8+aCYcYrZIwBp8nIBAwxQcMiYZRaSAAAAMGAOCRdY8CYhiB4iggIMdEBckUcStwgEN0LgqSIoVFDBpKOmquqqrLbqqjmBAAAh+QQJBABJACwAAAAAPAA8AIaTk5OUlJSVlZWWlpaXl5eYmJiampqbm5ucnJydnZ2fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6\/v7\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\/v7\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\/z38+Pc9hFyioMD7egQQLIl\/r2NHD0ojMMBedwu0dokPO\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\/RdvQkULSqVjz\/9kgsU9pmQAg2S7HdeITrowAgMMBjiwgn2rVCgfEIYogMOOOygSAzVjUdIDCtAWEJakQgRXX+F8IAhDgoKooMNNrRYBAzVsbCaITOwsMKNm+SwooaC2DDDDO4JIkONg2V\/piKGMhYhJJGEvFCjDJj14COGPRBSw5DLDUJDC9W1UCQ6F2II5CBbztDlIBxW1yA6S+KQww+FpLmmIDiAyUILPLpSZoaG2GlImyy82UuZTaLJ5SFSFoqODwnSGeiihuAAQww3PJfmmM8h8iSnnRrCww03nBnqqaimquqqrAoUCAAh+QQJBABKACwAAAAAPAA8AIaVlZWWlpaXl5eZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6\/v7\/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8\/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39\/g4OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH\/oBKgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpuKMRsbMZycGQwMGaKbFQ0NFaiPIBIPJYcUqxSHLBocKK6DEAUFDrS2hxoTExy9ghAGzROGtQ23hR4U1hvKShcHzQmzhNHTgy0X1hUg2UrMzoXhhRzWFNjpHAjNB6eD7oMjFdYWJtIJstDMQANCqlgRyhDvg8BBCu5ZGETK1KAP\/ihcEMVhQYN5hQgaKBBhUAkLFr4p4TDBGjpDLEKAYCGpAQAAAhZgMOSAXaIO1vIRSgFCQwYMIiQxABCg6YCShRgcXIRhZyESGzJozRBCkgcDTZsCICABUwkOW7V2cEHpAQGm\/k0FKLD0IW0GDiMuiWggIGyABJQ8pNUgAoYmCwgCMEUQ+GgGDydQYXAgrNIIESoeat7MuTOiI6BDi06CSQYKEyVSqzZxogajI0Ziy559BJOJDyBy6879gdci2LOD1750e\/fuDykaiRZt5AgSTDFOq15t4obn69izcyIiRIglFixCiRoSBIj5IJRSqE5hOFMRIebjo5+kfvUK65bgxz9vScX0Eie0QEkR5e0XxBCYvHDCfyi4Fol+8XlXCA88MBKDeIS0gJpqK0gCYRBEGLJDDjn0oMgMLbTQHiExrIAaCTRFwp0QIRrSA4k5VCgIDzbYoKMSMqTYAg2HzLDCCkRyiqIDjj4McsMMM+CnBA1CvrDZjSTuQIgNUNpACAxCJpnOD0uS2OQgXM7gJZoupOgCDgLxgKOJW3ZZSJApYtiLD2XqICGadhKywwtuiumKnCT+CKiahqCYZzaIamlImmsWAmYLMmQDBIXzFULpITvEIAOc2H2qXSKmnnrIDzjg8IOqsMYq66y01upKIAAh+QQJBABHACwAAAAAPAA8AIaYmJiZmZmampqbm5ucnJydnZ2fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6\/v7\/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8\/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nze3t7f39\/i4uIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH\/oBHgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpuKLhcXLpycFQYGFaKbD6UPqI8cDAoihw4HBw6HKRYYJa2DCwAACbO1t4YVDQ0XvYK\/AQHFhLS2hhkO1srLEgPOBbLRxIUpEdYPHMvMzgANhdLQghgN1hbn7wTOA6eD7YQfD9YQ3uhBcBYAASFVBlgNomDNgTl6gwo4ExBhEClTgzb4c1BRlBEjiCKkYzAoRIQIIQZdiOfw0IkOHFBI+kjzEAJn7qhZy0eoBIcKFCZ0mEmzZqFajCZMMATCAoWnEx5GKloUE4gLT7NiUEGJqlFKG4BmvfABk1eQkzJkpVDBQwtN\/l4paQhKQcOIVh8tefBgAqLfv4ADMyoypLDhw0QwvSARorHjxiNiMBoipLLly0MwidCwobPnzhpITL5MWkjmS5s\/fw49+LDrIYkvtRjx+LEIGoJz697dC4gPH5ZSpHiBCkgPHsh7UDIhormJt5mE+EBOXfmkEs2bj0iB25KP49R5AK90IntzElwnBQFf\/QemFSTMiyghQ9L09oZw4GDUAjohFSOYJ1Mk94kHhCE31FBDDp2ggAILhrhwQoAipCBJEL8daIgOCtawnyA5yCADg4K04CAKMBwCg4OScWJDhzoMMsMLL8wwyIoOpucXhwreQIgMNNY3yAonpgjRDi8qaRjjIEC+IKQgMqTgYAo20oNDhyQyGWQhLpzoXy86JGnDeFo6WcgNKkxpZC9XKphlmU8O8oKX57TpoyFNxjkICyec8CUqPOhH5o9bItiCCzXwlidviyzKaCI80EADD49WaumlmGaq6V+BAAAh+QQJBABIACwAAAAAPAA8AIaWlpaXl5eYmJiZmZmampqbm5udnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6\/v7\/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8\/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trc3Nzd3d3f39\/g4OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH\/oBIgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpuKLxcXL5ycEQYGEaKbDwcHD6iPHQwKIocOqw6HKRUXJK6DCwAACbS2hxQMDBe9gr8BAbeFtQfPhBkN1hbKSBIDzQUj0MSEKRDWDhzZSAvNANOC0e1IF9YN2OgYBM0D9e7hgh4O1h7MQockQrMACAipYkVowrwNBAcVaCbglCBSpgZtANgAgqgjR4wYOWQwAAAGg0BEiABi0AUG1s4ZStGBQwpJInMeMZSgGbxCGKxRMGSCQwUKEzzgzJnT0CpGEiQYCmGBgtUJHSYx1YkpxAWrYDOsoBRy68hKG46CvfABk9md\/pMygKVQwYMLTWWbTtqAlIIGXqKMgLTkwcOJiIgTK158qMgQIZAjQx5CBNOLESFAaN4cQoQMRkOCiB5NekhXDahTq\/62KDTp10JOq1adAbCiIpJzC6l8qYWIzJs1hwhBg7Hx48g5AfHhw9KJE3dF\/eixo3oPSiQ+ePhAYmymIT6qi78+acSH8x9AmJhxyQcP8dYtlUB\/PgQKSkLew+fxA5OKEPR94Jkk4YnHnyE33MAICyzMBCB6JhA4HhCG2EADDTgo4sJz3hHiggkgaHdYJEH04EMQh+RwIYaD4BBDDBkKwsJzJ8BwyAsnmGAjJzWsmMMgMrTQwmeC4PjcTYipgnihDYTEIGQMhKhAYygE8dDjhTsQAoOQOwoSAwrPoVAcOjesGOMgW7bQpSAt0NhgNjpcWUN\/WnJZyA0phEllL2Ve+GMhaa4pyIbPvdkLDkseEughK+TYQjY94HBDc4YsiiALLdSAXJpQJpeIky106ukhPMwwA3mjpqrqqqy26qoogQAAIfkECQQAPwAsAAAAADwAPACFmpqam5uboaGhoqKio6OjpKSkpaWlpqamp6enqKioqampqqqqq6urrKysra2trq6ur6+vsLCwsbGxsrKys7OztLS0tbW1tra2t7e3uLi4ubm5urq6u7u7vLy8vb29vr6+v7+\/wMDAwcHBwsLCw8PDxMTExcXFxsbGx8fHyMjIycnJysrKy8vLzMzMzc3Nzs7Oz8\/P0NDQ0dHR0tLS09PT1NTU1dXV1tbW19fX2NjY2tra29vb3d3d3t7e39\/fAAAABv7An3BILBqPyKRyyWw6n9CodEqtWq\/YrHarLDUaJi7XAAAYxFtCAEBAa9WBthHEaHDcTri8qBAIGnhNekYPA4YMgUyDRCAGhgQSiUuLQw4Ch5KTAXFEFQSGBRmZSgVlBUQKhgMRo0oHZQdDEZ8DZ1w+PT0+TxcGBhdDDZcDkUYeExIfUj08zbpUDoYKRh0RCgkIE8vN3D1U2EYWCwnkCMVQPtzq3lcXDOTwDSFUzOo87FQQ1\/AMFVe49nhQeQAvgYIJJLTkUjcQW4IHosTgwjeFAoU7rTJq3MhRyI0bOEKKBLkDSwkNFyyoXHkBQwomOWzInEkTBxYMDyDo3Knzgf4GJjhoCrVhsx3Pow82MNkhsmnIGzqwkMiQcqXKliw6at3KFcsNGjSsfPBQAo2NGTHSzqCywUIFCxtEaMlBI63dtVPasvSw4koNGXbVWuFg1QIGZVNwAA4sowaWEBkKa3gZpa7dxkZcuGAyQm4REBhWVuggxXIMGjeMtFCh4oUSEh06zCsCO2UFD1JwgE1tBAZrFZuFvECBwrWQEbE7hDFywkOHE2JY\/IYxJAUJEpR\/mHDeAfEo36xbEEFxHQWREMmXS5Kx4ncMIieuQx+CgrsHFZlc\/DY+JD6J+UPAFptngcDQngos2FCEfwAK90FsHjSIhn6s8deffEYI2AGBbjVQKB5zGBqBHgcjJEKDCy0oCOJ\/R7ggwghZaUUeCeZ1hcSMNdpoxAyshaXjj0AGKeSQRF4RBAA7')}";
});