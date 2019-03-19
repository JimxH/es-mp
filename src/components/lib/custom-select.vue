<template>
  	<span :class="showList ? 'border select-box' : 'select-box'">
    		<span></span>
    		<input
      			type="text"
      			:value="selectHtml"
      			:val="selectVal"
      			:id="vid"
      			:name="name"
      			@click="showList = !showList"
            onfocus="this.blur()"
    		/>
    		<ul v-show="showList">
      			<li
        				v-for="(value, index) in list"
        				:key="index"
        				:val="index"
        				v-html="value"
        				:class="value == selectHtml ? 'active' : ''"
        				@click="change(value, index)"
      			></li>
    		</ul>
  	</span>
</template>
<script>
/*子组件调用方法: 
    <custom-select
        @select1="changeEvent"
        value="小型车"
        val="02"
        vid="select1"
        :list="this.selectList"
        name="select1"
    ></custom-select>

    参数说明: 参数说明: 看下方prop对象说明
*/
export default {
    props:{
    		'list': [Object, Array], //下拉列表的数据(推荐json)
          	'value': {type: String, default: '所有'}, //选中的文字项 
          	'val': {type: String, default: ''},  //选中的索引项
          	'name': String,  //定义输入框的name
          	'vid': String  //定义输入框的id,父组级获取对象，向父组级发送事件等,
        },
        data(){
            return {
                showList: false,
                selectVal: this.val,
                selectHtml: this.value,
            }
        },
    methods:{
        change (value, val){
          	this.selectVal = val;
          	this.selectHtml = value;
          	this.showList = false;
            if(this.vid){
                this.$emit(this.vid, val);
            }
        },
        documentClick (e){
    		    if(!this.$el.contains(e.target)) {
                this.showList = false;
          }
    	  }
    },
    mounted (){
    	  document.addEventListener('click', this.documentClick)
    },
    beforeDestroy () {
        document.removeEventListener('click', this.documentClick)
    }
};
</script>


<style scoped>
.select-box{
  display:inline-block;
  position:relative;
  top: 8px;
  height:25px;
  width:110px;
  background:#FFF;
  border:solid 1px #ccc;
  border-radius: 3px;
  font-size: 14px;
  transition:  0.3s;
  -moz-transition:  0.3s;
  -webkit-transition:  0.3s;
  -o-transition:  0.3s;
}
.select-box span{
    position:absolute;
    width:20px;
    height:100%;
    right:0;
    top:0;
    background:url('../../assets/images/icon/pull-down.png') no-repeat -1px 6px;
}
.select-box input{
    position:absolute;
    width:98%;
    padding-left:6%;
    height:100%;
    z-index:2;
    left:0;
    top:0;
    background:none;
    border:none;
    cursor:pointer;
    color: #606266;
}

.select-box ul{
    width:100%;
    position:absolute;
    top:25px;
    left:-1px;
    z-index: 100;
    background: #fff;
    border:solid 1px #ccc;
    border-top: none;
    margin-top: 1px;
    border-radius: 3px;
    box-shadow: 0 1px 6px #ccc;
}
.select-box ul li{
    line-height: 30px;
    padding-left:6%;
    color: #606266;
    cursor: pointer;
}
.select-box ul li:hover{
    background: #f5f7fa;
}
.select-box ul .active{
    color:red;
}
</style>
