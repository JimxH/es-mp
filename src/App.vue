<template>
    <div id="app"  :class="this.$store.state.theme">
        <homeMenu v-show="this.$store.state.isLogin"></homeMenu>  <!-- 菜单组件 -->
        <div id="counter">
            <div class="cont-top">
                <homeNav v-show="this.$store.state.isLogin"></homeNav>
            </div>

              <!-- 需要缓存的组件视图入口 -->
              <keep-alive>
                  <router-view v-if="$route.meta.keepAlive" :class="[$store.state.theme,'cont-view']"></router-view>
              </keep-alive>

              <transition name="fade" mode="out-in">
                  <!-- 不需要缓存的组件视图入口 -->
                  <router-view v-if="!$route.meta.keepAlive" :class="[$store.state.theme,'cont-view']"></router-view>
               </transition>

        </div>

        <!--遮罩层-->
        <div class="masked" v-show="this.$store.state.masked"><b></b></div>
        <!-- 导出form盒子 -->
        <div style="display:none;" id="divSubmit"></div>
    </div>
</template>

<script>
//导航
import homeMenu from './components/content/menu/menu.vue';  //引入菜单组件
import homeNav from './components/content/menu/nav.vue';  //引入nav组件

export default {
    name: 'App',
    data (){
        return {
        }
    },
    components: {
        homeMenu,  //登记左边菜单组件
        homeNav   //等级顶部nav
    },
    methods: {

    }
};

</script>

<style>
@import './css/common.css';
</style>
