//全局导出方法
import Vue from 'vue'
export default function(url, data){
	var oSubDiv = document.getElementById("divSubmit");
	oSubDiv.innerHTML = '';
	var _html = "<form id='exportForm' action='"+ url +"' method='post'>";
	_html += "<input name='req' value='"+ JSON.stringify(data) +"'/> ";
	_html += "</form>";

	oSubDiv.innerHTML=_html;
    document.getElementById('exportForm').submit();
};