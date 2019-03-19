// 引入全家桶
import Vue from 'vue'
import router from './vue-model/router'
import store from './vue-model/vuex/store'
import vueAxios from './vue-model/axios/axios'



//全局公共js 调用：this.$api 参数看对应的js文件

import api from './vue-model/axios/api' //接口定义文件
Vue.prototype.$api = api;

import errorCode from './js/common/error-code'//error-code错误码js文件，
Vue.prototype.$error = errorCode;

import vueDialog from './vue-model/dialog/dialog' //弹出框功能
Vue.prototype.$dialog = vueDialog;

//导出通用功能，调用方法看js文件
import Export from './vue-model/axios/export'
Vue.prototype.$export = Export;

//全局组件(调用方法看对应.vue文件)

import datepicker from './components/lib/vue-data-picker.vue'; //日期组件
Vue.component('datepicker', datepicker);

import select from './components/lib/custom-select.vue'; //下拉组件
Vue.component('custom-select', select);


//引入主页模版
import App from './App'


//实例化
Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示
new Vue({
	el: '#app',
	store,
	router,
	components: {
		App
	},
	template: '<App/>'
})
