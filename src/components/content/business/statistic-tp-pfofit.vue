<template>
    <div>
        <div class="query-head">

            <label>支付日期：</label>
            <datepicker vid="beginDate" format="YYYY-MM" value="2019-01"></datepicker>

            <div class="btn-box">
                <button @click="query" class="btn">统计</button>
                <button @click="exportFile" class="btn">导出</button>
                <button @click="exportFile('list')" class="btn">导出订单清单</button>
            </div>

        </div>
        <div class="query-msg-box">
            <div>
                <table cellspacing="0" cellpadding="0">
                  <thead>
                    <tr>
                      <th>日期</th>
                      <th>已完成订单</th>
                      <th>本人本车订单</th>
                      <th>不扣分代缴订单</th>
                      <th>扣分代缴订单</th>
                      <th>分润金额</th>
                      <th>本人本车分润</th>
                      <th>不扣分代缴分润</th>
                      <th>扣分代缴分润</th>
                    </tr>
                  </thead>
                  <tbody >
                    <tr v-if="dataList != ''" v-for="(val, index) in dataList" :key="index">
                        <td>{{val.order_finish_date}}</td>
                        <td>{{val.order_done_count}}</td>
                        <td>{{val.order_owner_count}}</td>
                        <td>{{val.order_point_count}}</td>
                        <td>{{val.order_nopoint_count}}</td>
                        <td>{{val.order_porfit_amount/100 | numFilter}}</td>
                        <td>{{val.order_owner_profit/100 | numFilter}}</td>
                        <td>{{ val.order_point_profit/100 | numFilter}}</td>
                        <td>{{val.order_nopoint_profit/100 | numFilter}}</td>
                    </tr>
                    <tr v-if="dataList">
                      <td>总计</td>
                      <td>{{total('order_done_count')}}单</td>
                      <td>{{total('order_owner_count')}}单</td>
                      <td>{{total('order_point_count')}}单</td>
                      <td>{{total('order_nopoint_count')}}单</td>
                      <td>{{total('order_porfit_amount',2)}}元</td>
                      <td>{{total('order_owner_profit',2)}}元</td>
                      <td>{{total('order_point_profit',2)}}元</td>
                      <td>{{total('order_nopoint_profit',2)}}元</td>
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
    name: 'statistic-tp-pfofit',

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

        var _this = this;
        this.$http.post(
          this.$api.violation.profitStatistic,
          {
            'pay_begin_date': beginDate.value,
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
      //列表总计
      total: function(index,fix){
        var count = 0;
        if(this.dataList){
          this.dataList.forEach(function(data){
            if(fix){
                count += (data[index]*1)/100;
                count = Number(count.toFixed(fix));
            }else{
                count += Number(data[index]);
            }

          })
        }
        return count;
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
      exportFile:function(name){
        var url = this.$api.violation.exportProfitStatistic;
        if (name == 'list'){
          url = this.$api.violation.exportProfitStatisticOrder;
        }
        var _html = "<form id='frmSubmit' action='"+ url +"' method='post'>";
        _html += "<input name='pay_begin_date' value='"+ beginDate.value +"'/> ";
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
    filters: {
      numFilter(value) {
        value=Number(value);
        return value.toFixed(2);
      }
    },
    mounted (){
        setTimeout(this.query, 0);
    }
}
</script>

<style>

</style>
