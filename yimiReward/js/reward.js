

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
  alert("dsinit");

  dash.dsinit = function(){

    alert("dsinit");
		this.flag = 0;
		this.d = document;
    alert("dsinit");
		this.d.getElementById("dash-main-id-8793a5").innerHTML = this.dshtml();
		this.dscss();
	};


	dash.dshtml = function(){
    alert("a1a");
		var url = encodeURIComponent(window.location.href);
    
		return "<a href=\""+ dash.urlprefix +"/yimiReward/index.htm\" id=\"dash-tip-id\" class=\"dash-tip\" target=\"_blank\">" +
				"<img id=\"dash-img-id\" src=\""+ dash.urlprefix +"/yimiReward/img/yimiReward.png\" alt=\"一觅打赏\" /></a>";
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
		document.getElementById("dash-main-id-8793a5").appendChild(obj);
	};

	return dash;
}
