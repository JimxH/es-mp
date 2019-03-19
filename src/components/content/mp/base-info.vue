<template>
    <div>
        <div class="view-content-top">
            <table class="base-info-tab">
                <tr>
                    <td class="title">账号：</td>
                    <td v-text="baseInfo.mp_account"></td>
                    <td class="title">修改登录密码：</td>
                    <td>
                        <span v-text="baseInfo.mp_password"></span>
                        <a href="javascript:;" @click="openDialog(1)">【修改】</a>
                    </td>
                </tr>
                <tr>
                    <td class="title">公司名称：</td>
                    <td v-text="baseInfo.mp_company_name"></td>
                    <td class="title">社会信用代码：</td>
                    <td  v-text="baseInfo.mp_credit_code"></td>
                </tr>
                <tr>
                    <td class="title">联系人：</td>
                    <td v-text="baseInfo.mp_contact_person1"></td>
                    <td class="title">联系电话：</td>
                    <td v-text="baseInfo.mp_contact_phone1"></td>
                </tr>
                <tr>
                    <td class="title">违章查询API：</td>
                    <td  v-text="baseInfo.mp_api_query"></td>
                    <td class="title">嵌入页面：</td>
                    <td v-text="baseInfo.mp_page_query"></td>
                </tr>
                <tr>
                    <td class="title">剩余查询次数：</td>
                    <td v-text="maxCount = baseInfo.mp_residue_count"></td>
                    <td class="title">预警次数：</td>
                    <td>
                        <span id="warn_count" v-text="baseInfo.mp_warn_count"></span>
                        <a href="javascript:;" @click="openDialog(2)">【修改】</a>
                    </td>
                </tr>
                <tr>
                    <td class="title">代缴分润：</td>
                    <td colspan="3">
                        <span class="info">本人本车代缴<em v-text="baseInfo.mp_owner_profit"></em>元/笔</span>
                        <span class="info">不扣分代缴<em v-text="baseInfo.mp_nopoint_profit"></em>元/笔</span>
                        <span class="info">扣分代缴<em v-text="baseInfo.mp_point_profit"></em>元/笔</span>
                    </td>
                </tr>
                <tr>
                    <td class="title">网站回调域：</td>
                    <td colspan="3" v-text="baseInfo.mp_callback_domain"></td>
                </tr>
                <tr>
                    <td class="title">网站域名：</td>
                    <td colspan="3" v-text="baseInfo.mp_domain"></td>
                </tr>
                <tr>
                    <td class="title">应用ID：</td>
                    <td colspan="3" v-text="baseInfo.mp_application_id"></td>
                </tr>
                <tr>
                    <td class="title">KEY：</td>
                    <td colspan="3" v-text="baseInfo.mp_application_key"></td>
                </tr>
                <tr>
                    <td class="title">商家系统默认返回地址：</td>
                    <td colspan="3" v-text="baseInfo.mp_default_return"></td>
                </tr>
                <tr>
                    <td class="title">商家系统获取访问凭证地址：</td>
                    <td colspan="3" v-text="baseInfo.mp_access_token_callback"></td>
                </tr>
            </table>
            <div class="showPass" v-show="showPass">
                <p>
                    <span>输入旧密码：</span>
                    <input placeholder="输入旧密码" type="password" v-model="mp_old_password">
                </p>
                <p>
                    <span>输入新密码：</span>
                    <input placeholder="长度6到16位，数字、字母、下划线" type="password" v-model="mp_new_password">
                </p>
                <p>
                    <span>再次输入新密码：</span>
                    <input placeholder="长度6到16位，数字、字母、下划线" type="password" v-model="mp_new_password2">
                </p>
                <p>
                    <button class="btn" @click="changePass">确定</button>
                    <button class="btn" @click="closePass">取消</button>
                </p>
            </div>
            <div class="showPass showWarn" v-show="showWarn">
                <p class="title">将预警次数修改为：</p>
                <p>
                    剩余
                    <input placeholder="输入整数" type="text" v-model="new_warn_count">次时预警
                </p>
                <p>
                    <button class="btn" @click="changeWarn($event)">确定</button>
                    <button class="btn" @click="closeWarn">取消</button>
                </p>
            </div>
            <div class="base-info-pop" v-show="popShow"></div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">

export default {
    name: 'home',
    data () {
        return {
            baseInfo: '',
            showPass: false,
            showWarn: false,
            popShow: false,

            mp_old_password: '',
            mp_new_password: '',
            mp_new_password2: '',


            old_warn_count: '',
            new_warn_count: '',
            maxCount: ''
        }
    },
    methods: {
        queryList: function(){
            var _this = this;
            this.$http.post(this.$api.user.baseInfo).then(function(data){
                if(data.s_state == 'ss0000'){
                    _this.baseInfo = data;
                }else{
                    _this.$dialog.alert(_this.$error(data.s_state) || '查询数据出错，请刷新页面重试')
                }
            }).catch(function(){
                _this.$dialog.alert('系统繁忙，请刷新页面重试')
            })
        },
        changePass (){
            //校验
            if(this.mp_old_password == ""){
                this.$dialog.alert("请输入旧密码");
                return false;
            }else{

            } 
            if(this.mp_new_password == ""){
                this.$dialog.alert("请输入新密码");
                return false;
            }else if(this.mp_old_password == this.mp_new_password){
                this.$dialog.alert("新密码不能与旧密码相同");
                return false;
            }else{

            }
            if(this.mp_new_password2 == ""){
                this.$dialog.alert("请再次输入新密码");
                return false;
                
            }else if(this.mp_new_password != this.mp_new_password2){
                this.$dialog.alert("两次输入密码不一致，请检查");
                return false;
            }else{

            }

            var _this = this;
            this.$http.post(
                this.$api.user.password,
                {
                    'mp_new_password': _this.mp_new_password,
                    'mp_old_password': _this.mp_old_password
                }
            ).then(function(data){
                if(data.s_state == 'ss0000'){
                    _this.$dialog.alert({
                        text: "密码修改成功"
                    }, function(){
                        _this.closePass();
                    });

                }else{
                    _this.$dialog.alert(_this.$error(data.s_state) || "密码修改失败，请重试");
                }
            }).catch(function(error){
                _this.$dialog.alert("网络错误，请稍候再试");
            })
        },
        changeWarn (){
            //校验 
            var _this = this;
            if(this.new_warn_count == this.old_warn_count){
                //与原来相同情况下，默认不设置请求
                _this.closeWarn();
                return false;
            }else if(this.new_warn_count == ''){
                this.$dialog.alert({
                    text: "预警次数不能为空"
                });
                return false;
            }else if(this.new_warn_count <= 0){
                this.$dialog.alert({
                    text: "预警次数必须是正整数"
                });
                return false;
            }else if(parseInt(this.new_warn_count) != this.new_warn_count){
                this.$dialog.alert({
                    text: "预警次数必须是正整数"
                });
                return false;
            }else if(this.new_warn_count >= (this.maxCount * 1)){
                this.$dialog.alert({
                    text: "预警次数必须小于剩余查询次数"
                });
                return false;
            }
            
            this.$http.post(
                this.$api.user.warncount,
                {
                    'warn_count': _this.new_warn_count
                }
            ).then(function(data){
                if(data.s_state == 'ss0000'){
                    _this.$dialog.alert({
                        text: "预警次数修改成功"
                    }, function(){
                        document.getElementById("warn_count").innerHTML = _this.new_warn_count;
                        _this.closeWarn();
                    });

                }else{
                    _this.$dialog.alert(_this.$error(data.s_state) || "预警次数修改失败，请重试");
                }
            }).catch(function(error){
                _this.$dialog.alert("网络错误，请稍候再试");
            })
        },
        openDialog (type){
            if(type == 1){
                this.showPass = true;
            }else{
                var html = document.getElementById("warn_count").innerHTML;
                this.new_warn_count = html;
                this.old_warn_count = html;
                this.showWarn = true;
            }
            this.popShow = true;
        },
        closePass(){

            this.mp_old_password = '';
            this.mp_new_password = '';
            this.mp_new_password2 = '';

            this.showPass = false;
            this.popShow = false;
        },
        closeWarn(){
            this.showWarn = false;
            this.popShow = false;
        }
    },
    mounted (){
        this.queryList();
    }
};
</script>
<style scoped>
.view-content-top{
    position:relative;
}

.base-info-tab{
    width:100%;
    margin:0 auto;
    text-align:center;
    overflow:hidden;
}

.base-info-tab td{
    height:40px;
    text-align:left;
}
.base-info-tab td a{
    color:blue;
}
.base-info-tab .title{
    text-align:right;
}
.base-info-tab td .info{
    text-align:center;
    display:inline-block;
    width:30%;
}
.base-info-tab td em{
    font-style: normal;
}

.showPass{
    width:500px;
    height:162px;
    border:1px solid #aecff1;
    border-radius:6px;
    position:fixed;
    left:50%;
    top:50%;
    padding-top:20px;
    background:#fff;
    margin:-83px 0 0 -200px;
    z-index:2222;
    box-shadow:0 4px 12px rgba(0,0,0,.15)
}
.showPass p{
    height:36px;
    text-align:center;
}
.showPass p span{
    width:125px;
    display:inline-block;
    text-align:right;
}
.showPass p input{
    width:260px;
    height:26px;
}
.showWarn p button,
.showPass p button{
    width:80px;
    margin:0 15px;
    margin-top:6px;
}
.showWarn{
    width:300px;
    height:124px;
    margin:-62px 0 0 -150px;
}
.showWarn p input{
    width:80px;
    margin:0 10px;
}
.showWarn .title{
    font-weight:bold;
    font-size:16px;
}
.base-info-pop{
    width:100%;
    height:100%;
    position:fixed;
    background:#999;
    opacity: 0.4;
    z-index:1111;
    left:0;top:0;
}
</style>
