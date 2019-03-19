import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production', // 在非生产环境下，使用严格模式
  	state: { //全局属性存放处
        theme: 'sea',  //主题样式 garden/sea/sunrise
	    isLogin:false,  //控制菜单显示隐藏
      	menuList: {},  //左侧菜单列表
        masked: false,   //遮罩层显示 true/false
        label: {
            active: '/',
            labelList: ["/"]
        }
    },
    mutations: { //全局属性设置方法
        changeMenu (state, list) {
            if(list){
                state.menuList = list;
                state.isLogin = true;
            }else{
                state.menuList = {};
                state.isLogin = false;
            }
        },
        changeLabel (state, json){
            state.label = json;
        },
        addLabel (state, index){
            //记录数据
            state.label.active = index;
            var list = state.label.labelList;
            if(list.length){
                var have = true;
                for(var i = 0; i < list.length; i++){
                    if(list[i] == index){
                        have = false;
                        break;
                    }
                }
                have && state.label.labelList.push(index);
            }else{
                state.label.labelList.push(index);
            }
            localStorage.setItem("label", JSON.stringify(state.label));
            //改变Dom
        },
        removeLabel (state, index){
            var list = state.label.labelList;
            for(var i = 0; i < list.length; i++){
                if(list[i] == index){
                    state.label.labelList.splice(i, 1);
                    if(index == state.label.active){
                        state.label.active = list[list.length - 1];
                        setTimeout(function(){
                            location.hash = list[list.length - 1];
                        }, 100);
                    }
                    break;
                }
            }
            localStorage.setItem("label", JSON.stringify(state.label));
        },
        changeTheme (state,name){
          if(name){
            state.theme = name;
            localStorage.setItem("mp-theme", name);
          }
        },
        //重新登录
        logInAgain(state){
          state.sId = '';
          state.label = '';
          localStorage.setItem("sId",'');
          localStorage.setItem("label",'');
          window.location.reload();
        },
        changeMasked (state, bl){
            state.masked = bl;
        }
    },
    actions: { //全局请求方法
        queryMenu (state, options) {
            options.rt.$http.post(options.rt.$api.user.menuList).then(function(data){
                //保存菜单信息
                if(data.s_state == "ss0000"){
                    store.commit('changeMenu', data.list);
                    options.cb && options.cb();
                }else{
                    options.rt.$dialog.alert({
                        text: _this.$error(data.s_state) || '请求菜单列表失败，请刷新后重试'
                    }, function(){
                        window.reload();
                    })
                }
            }).catch(function(error){
                options.rt.$dialog.alert({
                    text: '网络错误，请刷新后重试'
                })
            });
        }
    }
})

export default store;
