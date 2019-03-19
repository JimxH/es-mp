<template>
    <div id="homeNav">
        <div class="userBox">
            <div class="theme-box">
                <b id="themeB" class="bg">主题</b>
                <div class="chge-them">
                     <b class="theme1" title="sunrise" @click="$store.commit('changeTheme', 'sunrise')"></b>
                     <b class="theme2" title="sea"     @click="$store.commit('changeTheme', 'sea')"></b>
                     <b class="theme3" title="garden"  @click="$store.commit('changeTheme', 'garden')"></b>
                </div>
            </div>
            <div class="log-box">
                <img class="loge-img" src="../../../assets/images/icon/log-user.png" height="40px" width="40px"/>
                <b>&nbsp;</b>
                <div class="log-menu">
                    <b>&nbsp;</b>
                    <a  @click="$store.commit('logInAgain')" href="#/">退出登录</a>
                </div>
            </div>
        </div>
        <ul id="listBox" class="nav-list">
            <li v-for="(value, index) in $store.state.label.labelList" :key="value" :class="(value == $store.state.label.active ? 'active' : '')">
                <a
                    :href="'#' + value"
                    v-html="$store.state.menuList[value]"
                    @click="$store.commit('addLabel', value)"

                ></a>
                <span
                    v-if="value != '/'"
                    class="close"
                    href="javascript:;"
                    @click="$store.commit('removeLabel', value)"
                >x</span>
            </li>
        </ul>
    </div>
</template>

<script scoped type="text/ecmascript-6">
export default {
    name: 'menu-list',
    data () {
        return {
        }
    },
    methods: {

    },
    mounted: function(){

    }
};
</script>

<style scoped>
</style>
