<template>
    <div class="login-box">
        <div  class="login-box">
            <img class='log-img' src="../../assets/images/icon/zyt-logo.png"  alt="掌溢通科技网络有限公司" />
            <div class='login-msg'>
                <h2>BTB违章服务管理平台</h2>
                <p class='log-name'>
                    <span></span>
                    <input type="text" value="" v-model="user" placeholder="用户名" maxlength="30"/>
                </p>
                <p class='log-psw'>
                    <span></span>
                    <input type="text" value="" v-model="pass" placeholder="密码" maxlength="30"/>
                </p>
                <p class='log-check'>
                    <span></span>
                    <input type="text" value="fe55" v-model="check" placeholder="验证码" maxlength="4"/>
                    <img 
                        :src="env + '/msc/mp/login/validate-code?time_stamp=' +　time_stamp" 
                        title="点击换一张" 
                        class="check-img"
                        @click="time_stamp = new Date().getTime()" 
                    >
                </p>
                <p><button class='log-btn btn' @click='login'>登录用户</button></p>
            </div>
            <div class='log-foot'>
                <p>
                      Copyright © 
                      <a href="http://www.24pay.net" target="_blank" rel="nofollow" class="a">www.24pay.net</a> All Rights Reserved. 粤ICP备11006053号 经营许可证 粤B2-20130163
                </p>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: 'login',
    data (){
        return {
            env: process.env.API_ROOT,
            user: '',
            pass: '',
            check:'',
            time_stamp: '1547532553046'
        }
    },
    methods: {
        login: function(ev, res){
            //校验
            var err = [];
            if(this.user == ""){
                err.push("请输入用户名");
            }else{

            } 
            if(this.pass == ""){
                err.push("请输入密码");
            }else{

            }
            if(this.check == ""){
                err.push("请输入验证码");
                
            }else if(this.check.length != 4){
                err.push("请输入正确的验证码");
            }
            if(err.length){
                var html = '<p style="color:red;">';
                for(var i = 0; i < err.length; i++){
                    html += err[i] + '</br>'
                }
                this.$dialog.alert(html + '</p>');
                return false;
            }

            //请求功能
            var rt = this.$route.query;
            var path = '';
            if(rt.redirect){
                path = rt.redirect;
            }else{
                path = '/';  //登陆后默认去首页
            }
            var _this = this;
            this.$http.post(
                    this.$api.user.login, 
                    {
                        "mp_code": this.user, 
                        "mp_password": this.pass,
                        "mp_vaildate_code": this.check
                    }
            ).then(function(data){
                if(data.s_state == "ss0000"){
                    localStorage.setItem("sId", data.s_ssid);
                    _this.$store.dispatch('queryMenu', {
                        rt: _this,
                        cb: function(){
                            //跳转到来时的页面
                            _this.$router.push({
                                path: path
                            });
                        }
                    });
                }else{
                    _this.$dialog.alert(_this.$error(data.s_state) || '登录失败，请刷新页面重试')   
                }

            }).catch(function(error){
                _this.$dialog.alert('系统繁忙，请刷新页面重试')
            });
        }
    }
};
</script>

<style scoped>
@import '../../css/login.css';
</style>
