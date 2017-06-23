

document.onreadystatechange = function () {

  if(document.readyState=="complete"){
    var dash = yimiRewardCreate();
    dash.dsinit();
  }
}



function yimiRewardCreate() {
  var dash = new Object;
	dash.d=null;
	dash.flag=0;
	dash.urlprefix="http://word.98ki.com";

  dash.dsinit = function(){

		this.flag = 0;
		this.d = document;
		this.d.getElementById("dash-main-id-8793a5").innerHTML = this.dshtml();
		this.dscss();
	};


	dash.dshtml = function(){
		var url = encodeURIComponent(window.location.href);
    return "<button id=\"rewardButton\" onclick=\"location.href='http://word.98ki.com/yimiReward/index.htm'\" >一觅打赏</button>";

		};




	dash.dscss = function(){
		var obj = document.createElement('style');
		obj.type = "text/css";
		var styles = ".dash-main{position:relative;width:128px;height:128px;}"
						  + ".dash-main-1{position:relative;width:96px;height:96px;}"
						  + ".dash-main-2{position:relative;width:64px;height:64px;}"
						  + ".dash-main-3{position:relative;width:32px;height:32px;}"
						  + ".dash-main-4{position:relative;width:16px;height:16px;}"
						  + ".dash-main-5{position:relative;width:8px;height:8px;}"
						  + ".dash-tip img{position:relative;width:100%;height:100%;}"
              + "#rewardButton{border:1px solid #e91e63;width:200px;height:35px;background: #e91e63;font-size: 20px;color:#f2f2f2;outline:none;border-radius:20px 20px 20px 20px;}"
              + "#rewardButton:active {top:1px;left: 1px;position:relative;background: #db1b60;}";
		if (obj.styleSheet) obj.styleSheet.cssText = styles;
		else obj.appendChild(document.createTextNode(styles));
		document.getElementById("dash-main-id-8793a5").appendChild(obj);
	};

	return dash;
}
