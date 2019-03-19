<template>
    <div>
        <div class="query-head">

            <label>支付日期：</label>
            <datepicker vid="beginDate" name="1"></datepicker> 至
            <datepicker vid="endDate" name="2"></datepicker>

            <div class="btn-box">
                <button @click="query" class="btn">统计</button>
                <button @click="exportFile" class="btn">导出</button>
            </div>

        </div>
        <div class="query-msg-box">
            <div>
                <table cellspacing="0" cellpadding="0">
                  <thead>
                    <tr>
                      <th>支付日期</th>
                      <th>订单数</th>
                      <th>已完成</th>
                      <th>处理中</th>
                      <th>已退单</th>
                      <th width="8%">待单</th>
                      <th width="12%">本人本车订单</th>
                      <th>不扣分订单</th>
                      <th>扣分订单</th>
                    </tr>
                  </thead>
                  <tbody >
                    <tr v-if="dataList != ''" v-for="(val, index) in dataList" :key="index">
                        <td>{{val.order_pay_date}}</td>
                        <td>{{val.order_count}}</td>
                        <td>{{val.order_done_count}}</td>
                        <td>{{val.order_process_count}}</td>
                        <td>{{val.order_refund_count}}</td>
                        <td>{{val.order_wait_count}}</td>
                        <td>{{val.order_owner_count}}</td>
                        <td>{{ val.order_point_count}}</td>
                        <td>{{val.order_nopoint_count}}</td>
                    </tr>
                    <tr v-if="dataList == ''">
                      <td colspan="10">没有数据</td>
                    </tr>
                  </tbody>
                </table>
            </div>

            <div id="pagination-box">
                <label>总计：</label> <b class="txt">{{dataCount}}</b>
                <custom-select
                  :list="{'10':'10/页', '20':'20/页','50': '50/页'}"
                  vid="sizeSelect"
                  :val="pageSize"
                  value="10/页"
                  @sizeSelect="changePageSize"
                  ></custom-select>

                  <b class="sel-lef" @click="reducePage"></b>
                  <span class="txt">{{pageNo}}</span>/<span>{{pageCount}}</span>
                  <b class="sel-rig" @click="addPage"></b>

                <label>跳转至：</label>
                <input type="text" id="goToPag" value="1" maxlength="3" @change="toPage"/>
            </div>

            <div style="display:none;" id="divSubmit"></div>

        </div>
    </div>
</template>

<script type="text/ecmascript-6">

export default {
    name: 'statistic-tp-order',

    data () {
      return {
          dataList:'',
          pageNo:'1',
          pageCount:'1',
          goToPag:'1',
          dataCount:'0',
          pageSize:'10',

        }
    },
    methods: {

      query: function(ev, res){
        //验证日期
        if (!this.verifyDate()) {
            return;
        }

        var _this = this;
        this.$http.post(
          this.$api.violation.tpStatistic,
          {
            'pay_begin_date': beginDate.value,
            'pay_end_date'  : endDate.value,
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
        var _html = "<form id='frmSubmit' action='"+  this.$api.violation.exportTpStatistic +"' method='post'>";
        _html += "<input name='pay_begin_date' value='"+ beginDate.value +"'/> ";
        _html += "<input name='pay_end_date' value='"+ endDate.value +"'/> ";
        _html += "</form>";

        divSubmit.innerHTML=_html;
        frmSubmit.submit();
      },
      //换每页数
      changePageSize:function(val){
          this.pageSize=val;
          this.query();
      }

    },
    mounted (){
        setTimeout(this.query, 0);
    }
}
</script>

<style>

</style>
