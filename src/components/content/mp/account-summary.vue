<template>
    <div>
        <div class="query-msg-box">
            <div class="view-content-top">
                <table cellspacing="0" cellpadding="0" class="">
                    <thead>
                        <tr>
                          <th>账户剩余资金</th>
                          <th>剩余查询次数</th>
                          <th>本月查询总量</th>
                          <th>本月已完成代缴订单</th>
                          <th>本月待分润</th>
                          <th>累计分润</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="mp">
                            <td v-text="mp.mp_residue_money"></td>
                            <td v-text="mp.mp_residue_query_count"></td>
                            <td v-text="mp.mp_query_count"></td>
                            <td v-text="mp.mp_order_done"></td>
                            <td v-text="mp.mp_noprofit_amount"></td>
                            <td v-text="mp.mp_statistics_profit_amount"></td>
                        </tr>
                        <tr v-if="!mp">
                            <td colspan="6">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">

export default {
    name: 'home',
    data () {
        return {
            mp: {}
        }
    },
    methods: {
        queryList: function(){
            var _this = this;
            this.$http.post(this.$api.user.statisticsInfo).then(function(data){
                if(data.s_state == 'ss0000'){
                    _this.mp = data;
                }else{
                    _this.mp = '';
                    _this.$dialog.alert(_this.$error(data.s_state) || '查询数据出错，请刷新页面重试')
                }
            }).catch(function(){
                _this.mp = '';
                _this.$dialog.alert('系统繁忙，请刷新页面重试')
            })
        }
    },
    mounted (){
        this.queryList();

    }
};
</script>

