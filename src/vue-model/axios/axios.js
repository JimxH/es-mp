import Vue from 'vue'
import Qs from 'qs'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from '../router/index'
 
Vue.use(VueAxios, axios);

// 设置请求超时时间30秒
axios.defaults.timeout = 30000;
//设置请求域名
axios.defaults.baseURL = process.env.API_ROOT;


//请求之前拦截，做一些处理
axios.interceptors.request.use(
    config => {
        const app = router.app;
        app.$store.commit('changeMasked', true);
        const sId = localStorage.getItem("sId");//请求同时需讲sId带到参数中一并请求
        //判断当前环境，改变请求方式
        if(process.env.NODE_ENV == 'development'){
            config.method = 'get'
        }
        if(config.method == 'get'){
            if(config.data){//开发环境适用判断
                config.params = config.data;
            }else{
                config.params = config.params ? config.params : {};
            }
            sId && (config.params.s_ssid = sId);

            //后台默认接收传参格式  url + "req"= '{"a":1}';
            const req = JSON.stringify(config.params);
            console.log('get转换前---参数：' + req);
            config.params = {"req": req};
            console.log('get转换后---参数：req=' + req);
        }else{
            config.data = config.data ? config.data : {};
            sId && (config.data.s_ssid = sId);

            //后台默认接收传参格式  {"req": data};
            const req = JSON.stringify(config.data);
            config.data = {"req": req};
            console.log('post转换前---参数：' + req);
            config.data = Qs.stringify(config.data);
            console.log('post转换后---参数：' + config.data);
        }
        return config;
    },
    error => {
        return Promise.reject(err);
    }
);


//返回时拦截，做一些处理
axios.interceptors.response.use(
    response => {
        const app = router.app;
        app.$store.commit('changeMasked', false);
        if(response.data.s_state == 'se8888'){ //未登录，或s_id强制过
            app.$dialog.alert({
                text: "登录信息过期，请重新登录"
            }, function(){
                localStorage.setItem("sId", '');
                app.$store.commit('changeMenu', '');
                router.push({
                    path:"/mp/user/login",
                    querry:{redirect: router.app.$route.fullPath}//从哪个页面跳转
                })
            })
        }else if(response.data.s_ssid){ //session_id过期并未强制过期,需替换本地s_id
          	localStorage.setItem("sId", response.data.s_ssid);
        }
        console.log('返回结果：');
        console.log(response.data);
        console.log('——————————————————————————————————————');
        return response.data;
      },
    error => {
        return Promise.reject(error)
    }
)

