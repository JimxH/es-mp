<template>
    <div>
        <div class="query-head">
            <label>渠道：</label>
            <custom-select
                :list="typeList"
                vid="channel"
            ></custom-select>

            <label>日期：</label>
            <datepicker vid="beginDate" name="1"></datepicker> 至
            <datepicker vid="endDate" name="2"></datepicker>

            <div class="btn-box">
                <button @click="query" class="btn">查询</button>
                <button @click="exportFile" class="btn">导出</button>
            </div>

        </div>
        <div class="query-msg-box">
            <div>
                <table cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>日期</th>
                            <th>车牌</th>
                            <th>车型</th>
                            <th>车架号</th>
                            <th>发动机号</th>
                            <th>访问IP</th>
                            <th>查询耗时</th>
                            <th>查询状态</th>
                            <th>查询城市</th>
                            <th>查询结果</th>
                        </tr>
                    </thead>
                    <tbody >
                        <tr v-if="dataList != ''" v-for="(val, index) in dataList" :key="index">
                            <td v-text="val.query_date"></td>
                            <td v-text="val.license_no"></td>
                            <td v-text="val.vehicle_type"></td>
                            <td v-text="val.frame_no"></td>
                            <td v-text="val.engine_no"></td>
                            <td v-text="val.ip_no"></td>
                            <td v-text="val.cost_time"></td>
                            <td v-text="val.query_status"></td>
                            <td v-text="val.city_name"></td>
                            <td v-text="val.result_count"></td>
                        </tr>
                        <tr v-if="dataList == ''">
                            <td colspan="10">没有数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div id="pagination-box">
                <label>总计：</label> <b class="txt"　v-text="dataCount"></b>
                <custom-select
                    :list="pageType"
                    vid="sizeSelect"
                    :val="pageSize"
                    value="10/页"
                    @sizeSelect="changePageSize"
                ></custom-select>

                <b class="sel-lef" @click="reducePage"></b>
                <span class="txt" v-text="pageNo"></span>/<span v-text="pageCount"></span>
                <b class="sel-rig" @click="addPage"></b>

                <label>跳转至：</label>
                <input type="text" id="goToPag" value="1" maxlength="3" @change="toPage"/>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">

export default {
    name: 'query-traffic-penaltycoad',

    data () {
        return {
            typeList: {'': '所有', '0': 'API', '1': '嵌入页面'},
            pageType: {'10':'10/页', '20':'20/页','50': '50/页'},
            dataList:'',
            pageNo:'1',
            pageCount:'1',
            goToPag:'1',
            dataCount:'0',
            pageSize:'10',

        }
    },
    methods: {
        query: function(){
            //验证日期
            if (!this.verifyDate()) {
                return;
            }

            var _this = this;
            var channelVal = document.getElementById("channel").getAttribute('val');
            var beginDateVal = document.getElementById("beginDate").value;
            var endDateVal = document.getElementById("endDate").value;
            this.$http.post(
                this.$api.payment.flow,
                {
                    'tp_query_type' : channelVal,
                    'quey_begin_date': beginDateVal,
                    'query_end_date'  : endDateVal,
                    'page_size'     : this.pageSize,
                    'page_no'       : this.pageNo
                }
            ).then(function(data){
                if(data.s_state == "ss0000"){
                    _this.dataList=data.result.list;
                    _this.pageNo=data.result.pageNo;
                    _this.pageCount=data.result.pageCount;
                    _this.dataCount=data.result.dataCount;
                }else{
                    _this.$dialog.alert('请求数据失败');
                }

            }).catch(function(error){
                _this.$dialog.alert('请求数据失败');
            });
        },
        //日期验证
        verifyDate:function(){
            var beginD = new Date(beginDate.value).getTime();
            var endD   = new Date(endDate.value).getTime();
            if((endD - beginD) < 0 ){
                this.$dialog.alert('结束日不能大于起始日');
                return false;
            }
            return true;
        },
        //跳转到指定页数
        toPage:function(){
            var toPage= Number(goToPag.value);
            if(toPage>0 && toPage <= Number(this.pageCount)){
                this.pageNo=toPage;
                this.query();
            }else{
                this.$dialog.alert('选择的页数超出范围');
            }
        },
        //加减页
        addPage:function(){
            if(this.pageNo != this.pageCount){
                this.pageNo=Number(this.pageNo)+1;
                this.query();
            }else{
                this.$dialog.alert('已是最后一页');
            }
        },
        reducePage:function(){
            if(this.pageNo != 1){
                this.pageNo=Number(this.pageNo)-1;
                this.query();
            }else{
                this.$dialog.alert('当前为第一页');
            }
        },
        //导出
        exportFile:function(){
            //验证日期
            if (!this.verifyDate()) {
                return;
            }

            var channelVal = document.getElementById("channel").getAttribute('val');
            var beginDateVal = document.getElementById("beginDate").value;
            var endDateVal = document.getElementById("endDate").value;
            this.$export(this.$api.payment.export, {
                'tp_query_type' : channelVal,
                'quey_begin_date': beginDateVal,
                'query_end_date'  : endDateVal
            })
        },
        //换每页数
        changePageSize:function(val){
            this.pageSize = val;
            this.query();
        }
    },
    filters: {
        numFilter(value) {
            value=Number(value);
            return value.toFixed(2);
        }
    },
    mounted (){
        setTimeout(this.query, 0);
    }
};
</script>
