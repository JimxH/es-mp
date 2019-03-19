<template>

        <div v-show="visible" id="dialogBox">
            <div class="dialog-mask"></div>
            <div class="dialog-box" :class="visible ? 'show-dialog' : ''">
                <p class="dialog-title" v-html="title"></p>
                <div class="dialog-content-box">
                    <div 
                        class="dialog-content" 
                        v-html="text"
                        :style="left ? 'text-align:left' : 'text-align:center'"
                    ></div>
                </div>
                <div class="dialog-btn">
                    <a 
                        href="javascript:;"
                        class="btn" 
                        :class="type == 1 ? 'alert' : ''" 
                        v-html="type == 1 ? alertBtnText : confirmBtnText[0]"
                        @click="ok"
                    ></a>
                    <a 
                        href="javascript:;" 
                        v-if="type == 2" 
                        class="btn" 
                        v-html="(type == 2) && (confirmBtnText[1] || '取消')"
                        @click="cancel"
                    ></a>
                </div> 
            </div>
        </div>

</template>
<script>
export default {
    data (){
        return {
            type: 1,
            text: '',
            left: false,
            title: '提示',
            visible: false,
            alertBtnText: '确定',
            confirmBtnText: ['确定', '取消']
        }
    },
    methods: {
        ok (){},
        cancel (){}
    }
};
</script>


<style scoped>
@keyframes dialogShow
{
    from {top: -50px;opacity: 0;}
    to {top: 80px;opacity: 1;}
}
.dialog-mask{
    width:100%;
    height:100%;
    position:fixed;
    left: 0;
    top: 0;
    background:#262626;
    opacity:0.2;
    z-index:10000;
}
.dialog-box{
    width:260px;
    border: 1px solid #e8eaec;
    position:fixed;
    left:50%;
    top:-50px;
    margin-left:-130px;
    z-index:10001;
    background:#FFF;
    color:#515a6e;
    border-radius:6px;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
    opacity: 0;
}
.show-dialog{
    animation: dialogShow 0.3s forwards;
}
.dialog-box .dialog-title{
    font-size:16px;
    height:36px;
    line-height:36px;
    border-bottom:1px solid #e8eaec;
    text-align:center;
    font-weight: bold;
}
.dialog-box .dialog-content-box{
    line-height:26px;
    padding:20px 10px;
}
.dialog-box .dialog-content{
    width:100%;
    white-space:normal;
    word-break:break-all;
}
.dialog-box .dialog-btn{
    border-top: 1px solid #e8eaec;
    width:100%;
    height:36px;
}
.dialog-box .dialog-btn a{
    width:50%;
    height:36px;
    line-height:36px;
    float:left;
    padding:0;
    text-align:center;
    color: #000;
    border-radius: 0;
}
.dialog-box .dialog-btn .alert{
    width:100%;
}
</style>
