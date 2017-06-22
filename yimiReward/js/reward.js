document.onreadystatechange = functioin(){
  if(document.readyState=="complete"){
    yimiRewardCreate();
  }
}



function yimiRewardCreate() {
	var dash = new Object;
	dash.d=null;
	dash.flag=0;
	dash.suffix="-"+suffix;
	dash.extra="-"+extra;
	dash.mainid="dash-main-id";
	dash.imgid="dash-img-id";
	dash.urlprefix="http://word.98ki.com";

	dash.dsinit = function(){
		this.flag = 0;
		this.d = document;
		this.mainid += this.suffix+this.extra;

		this.d.getElementById(this.mainid).innerHTML = this.dshtml();

		this.dscss();
	};


	dash.dshtml = function(){

		var url = encodeURIComponent(window.location.href);

		return "<a href=\""+ dash.urlprefix +"/yimiReward/index.htm" class=\"dash-tip\" target=\"_blank\">" +
				"<img id=\"dash-img-id\" src=\""+ dash.urlprefix +"/yimiReward/img/yimiReward.png" alt=\"一觅打赏\" /></a>";
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
						  + ".dash-tip img{position:relative;width:100%;height:100%;}";
		if (obj.styleSheet) obj.styleSheet.cssText = styles;
		else obj.appendChild(document.createTextNode(styles));
		document.getElementById(this.mainid).appendChild(obj);
	};

	return dash;
}
