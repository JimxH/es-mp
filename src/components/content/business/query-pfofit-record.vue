<template>
    <div>
        <div class="query-head">

            <label>代缴完成月份：</label>
            <datepicker vid="beginDate" format="YYYY-MM" value="2019-01"></datepicker> 至
            <datepicker vid="endDate" format="YYYY-MM" value="2019-01"></datepicker>

            <div class="btn-box">
                <button @click="query" class="btn">查询</button>
            </div>

        </div>
        <div class="query-msg-box">
            <div>
                <table cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                          <th>公司名称</th>
                          <th>代缴完成月份</th>
                          <th>分润金额</th>
                          <th>分润方式</th>
                          <th>分润时间</th>
                          <th>操作</th>
                        </tr>
                    </thead>
                    <tbody >
                        <tr v-if="dataList != ''" v-for="(val, index) in dataList" :key="index">
                            <td v-text="val.company_name"></td>
                            <td v-text="val.profit_month"></td>
                            <td v-html="$options.filters.numFilter(val.profit_amount/100)"></td>
                            <td v-text="val.profit_type"></td>
                            <td v-text="val.profit_datetime"></td>
                            <td><a class="txt" v-text="'详情'" @click="detailFn(val.Id)"></a></td>
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

            <div id="detailBox">
                <h2>分润记录详情</h2>
                <p>
                    <label>代缴完成月份 ：</label><span v-html="profit_month"></span>
                    <label>分润金额（元） ：</label><span v-html="profit_amount"></span>
                </p>
                <p>
                    <label>分润方式 ：</label><span v-html="profit_type"></span>
                    <label>分润时间 ：</label><span v-html="profit_datetime"></span>
                </p>
                <p>
                    <label>开户名称 ：</label><span class="spanL" v-html="bank_name"></span>
                </p>
                <p>
                    <label>银行账户 ：</label><span class="spanL" v-html="bank_account"></span></p>
                <p>
                    <label>备注 ：</label><span class="spanL" v-html="remark"></span>
                </p>
            </div>

        </div>
    </div>
</template>

<script type="text/ecmascript-6">

export default {
    name: 'query-pfofit-record',

    data () {
      return {
          dataList : '',
          pageNo : '1',
          pageCount : '1',
          goToPag : '1',
          dataCount : '0',
          pageSize : '10',

          profit_month   : "",
          profit_amount  : "",
          profit_type    : "",
          profit_datetime: "",
          bank_name      : "",
          bank_account   : "",
          remark         : ""
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
            this.$api.violation.profitRecord,
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
      //换每页数
      changePageSize:function(val){
        this.pageSize=val;
        this.query();
      },
      //详情
      detailFn:function(Did){
          var _this = this;
          this.$http.post(
              this.$api.violation.profitRecordDetail,
              {
                'id': Did
              }
          ).then(function(data){
            if(data.s_state == "ss0000"){
                _this.profit_month=data.profit_month;
                _this.profit_amount=data.profit_amount;
                _this.profit_type=data.profit_type;
                _this.profit_datetime=data.profit_datetime;
                _this.bank_name=data.bank_name;
                _this.bank_account=data.bank_account;
                _this.remark=data.remark;

              detailBox.style.display="block";
            }else{
                _this.$dialog.alert('请求数据失败');
            }

          }).catch(function(error){
                _this.$dialog.alert('请求数据失败');
          });
      }

    },
    filters: {
      numFilter(value) {
        value=Number(value);
        return value.toFixed(2);
      }
    },
    mounted (){
        //点击其他 关闭弹出框
        var detailBox=document.getElementById('detailBox');
        document.addEventListener('click', function(e){
            if(detailBox){
              detailBox.style.display="none";
            }
        });
        detailBox.addEventListener("click",function(event){
            event=event||window.event;
            event.stopPropagation();
        });
        
        setTimeout(this.query, 0);
        
    }
}
</script>

<style>

</style>
