/*子组件调用模版:
	this.$dialog.alert(options, okFn); 
	this.$dialog.confirm(options, okFn, cencelFn);
	this.$dialog.alert('输入错误');
	this.$dialog.confirm('输入错误');

	options参数: string/json
		{
			title： '提示', 
			left: true/false  //'文字对齐方式，默认居中' 
			text: '输入错误', 
			alertBtnText, '确定', 
			confirmBtnText: ['确定', '取消']
		}
*/

import vue from 'vue'

import dialogTplt from '../../components/lib/dialog.vue'
// 返回一个 扩展实例构造器
const dialogConstructor = vue.extend(dialogTplt);
let instance = null;
const dialog = {
	update (options, ok, cancel){
		if (!instance) {
			//初始化弹出框
	      	instance = new dialogConstructor({
	        	el: document.createElement('div')
	      	})
	    }
	    
	    //更新 or 初始化 弹出框内容
		instance.text = options.text ? options.text : '错误';
		instance.left = options.left ? options.left : false;
		instance.type = options.type ? options.type : 1;
		instance.title = options.title ? options.title : '提示';
		instance.alertBtnText = options.alertBtnText ? options.alertBtnText : '确定';
		instance.confirmBtnText = options.confirmBtnText ? options.confirmBtnText : ['确定', '取消'];

		//定义确定取消事件
      	instance.ok = function(){
      		ok && ok.call(dialog);
      		dialog.close();
      	};
      	instance.cancel = function(){
      		cancel && cancel.call(dialog);
      		dialog.close();
      	};

      	document.body.appendChild(instance.$el)
      	vue.nextTick(() => {
	      instance.visible = true
	    })
	},
	alert (options, ok, cancel){
		if(typeof(options) == "string"){
			options = {'text': options};
		}
		options.type = 1;
		dialog.update(options, ok, cancel);
	},
	confirm (options, ok, cancel){
		if(typeof(options) == "string"){
			options = {'text': options};
		}
		options.type = 2;
		dialog.update(options, ok, cancel);
	},
	close (){
		instance.visible = false;
	}
}

export default dialog;
