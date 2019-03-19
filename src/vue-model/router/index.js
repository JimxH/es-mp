//引入公用js
import Vue from 'vue'
import VueRouter from 'vue-router'

//调用组件vue-router
Vue.use(VueRouter);

//定义路径以及模版配置
/*
params
    path   ---路由路径
    name   ---调用当前模版依据，调用模版，或者引入模版
    meta
        title   ---页面title
        keepAlive: false  --是否需要缓存该页面
        requireAuth   ---是否需要登录权限
    component   ---模版内容
*/
const defaultRouterMap = [{
    path: '/',
    name: 'home',
    meta: {
        title: '商家平台-用户概括',
        keepAlive: false,
        requireAuth: true
    },
    component: function(){
       return import('@/components/content/mp/account-summary')
    }
},{
    path: '/mp/user/login',
    name: 'login',
    meta: {
        title: '商家平台-登录',
        keepAlive: false,
        requireAuth: false
    },
    component: function(){
        return import('@/components/content/login')
    }
},{
    path: '/mp/basic/information',
    name: 'baseInfo',
    meta: {
        title: '商家平台-基本信息',
        keepAlive: false,
        requireAuth: true
    },
    component: function(){
        return import('@/components/content/mp/base-info')
    }
},{
    path: '/mp/business/query-traffic-penalty-coad',
    name: 'query-traffic-penalty-coad',
    meta: {
        title: '商家平台-违章查询流水',
        keepAlive: false,
        requireAuth: true
    },
    component: function(){
        return import('@/components/content/business/query-traffic-penaltycoad')
    }
},{
    path: '/mp/business/query-statistic-coad',
    name: 'query-statistic-coad',
    meta: {
        title: '商家平台-违章查询统计',
        keepAlive: false,
        requireAuth: true
    },
    component: function(){
        return import('@/components/content/business/query-statistic-coad')
    }
},{
    path: '/mp/business/query-tp-order',
    name: 'query-tp-order',
    meta: {
        title: '商家平台-代缴订单查询',
        keepAlive: false,
        requireAuth: true
    },
    component: function(){
        return import('@/components/content/business/query-tp-order')
    }
},{
    path: '/mp/business/statistic-tp-order',
    name: 'statistic-tp-order',
    meta: {
      title: '商家平台-代缴订单统计',
      keepAlive: false,
      requireAuth: true
    },
    component: function(){
      return import('@/components/content/business/statistic-tp-order')
    }
},{
    path: '/mp/business/statistic-tp-pfofit',
    name: 'statistic-tp-pfofit',
    meta: {
      title: '商家平台-代缴分润统计',
      keepAlive: false,
      requireAuth: true
    },
    component: function(){
      return import('@/components/content/business/statistic-tp-pfofit')
    }
},{
    path: '/mp/business/query-pfofit-record',
    name: 'query-pfofit-record',
    meta: {
      title: '商家平台-代缴分润记录',
      keepAlive: false,
      requireAuth: true
    },
    component: function(){
      return import('@/components/content/business/query-pfofit-record')
    }
},{
    path: '*',
    name: '404',
    meta: {
        title: '找不到页面-404',
        keepAlive: false,
        requireAuth: true
    },
    component: function(){
        return import('@/components/404/404')
    }
}];

//配置路由
const router = new VueRouter({
    mode: 'hash',
    linkActiveClass: 'menu-active',
    routes: defaultRouterMap
})

//将路由加到default组件
export default router;

//路由执行之前。判断用户是否登录  sId失效时间为页面关闭
router.beforeResolve(function(to, form,next){
    document.title = to.meta.title;

    //更新主题
    var hisTheme = localStorage.getItem("mp-theme");
    if(hisTheme){
      router.app.$store.commit("changeTheme", hisTheme);
    }

    if(localStorage.getItem("sId")){  //已登录
        if(to.fullPath.indexOf("login") != -1){ //已登录状态下防止访问登录页
            next({
                path: '/',
            })
        }else{
            //判断是否有菜单列表，没有则请求
            var list = router.app.$store.state.menuList;
            if(JSON.stringify(list) != '{}'){
                router.app.$store.commit('addLabel', to.fullPath);
                next();
            }else{
                router.app.$store.dispatch('queryMenu', {
                    rt: router.app,
                    cb: function(){
                        //跳转到来时的页面
                        next();
                    }
                });
            }
        }
    }else{
        //未登录
        var toPath = to.fullPath == (to.fullPath.indexOf("login") != -1) ? '/' : to.fullPath;

        //判断是否需要登录权限
        if(to.meta.requireAuth){
            next({
                path: '/mp/user/login',
                query: {redirect: toPath}
            })
        }else{
            next();
        }
    }

    var label = localStorage.getItem("label");
    if(label){
        router.app.$store.commit("changeLabel", JSON.parse(label));
    }

});
