<template>
    <div id="homeMenu" class="menu-list">
        <div class="home-img">
            <a href="#/" title="home"><img src="../../../assets/images/icon/zyt-logo.png" /></a>
        </div>
        <ul id="listBox">
            <li v-for="(value, key) in $store.state.menuList" :key="key">
                <a
                    :href="'#' + key"
                    v-html="value"
                    @click="$store.commit('addLabel', key)"
                    :class="(key == $store.state.label.active ? 'active' : '')"
                ></a>
            </li>
        </ul>
    </div>
</template>

<script>
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
