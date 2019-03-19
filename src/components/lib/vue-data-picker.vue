<template>
    <div class="datetime-picker">
        <input
            type="text"
            :name="name"
            :style="inputstyle"
            :class="show ? 'inputclass border' : 'inputclass' "
            :readonly="readonly"
            :value="pickedValue"
            @click="show = !show"
            onfocus="this.blur()"
            :id="vid"
        >
        <div class="picker-wrap" v-show="show">
            <!-- 年-月-日 -->
            <table class="date-picker" v-if="format != 'YYYY-MM'">
                <thead>
                    <tr class="date-head">
                        <th :colspan="4">
                            <span class="btn-prev" @click="yearClick(-1)">&lt;</span>
                            <span class="show-year">{{now.getFullYear() + ' 年'}}</span>
                            <span class="btn-next" @click="yearClick(1)">&gt;</span>
                        </th>
                        <th colspan="3">
                            <span class="btn-prev" @click="monthClick(-1)">&lt;</span>
                            <span class="show-month">{{months[now.getMonth()]}}</span>
                            <span class="btn-next" @click="monthClick(1)">&gt;</span>
                        </th>
                    </tr>
                    <tr class="date-days">
                        <th v-for="day in days" :key="day">{{day}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(v, i) in 6" :key="i">
                        <td v-for="(v, j) in 7"
                            :key="j"
                            :class="date[i * 7 + j] && date[i * 7 + j].status"
                            :date="date[i * 7 + j] && date[i * 7 + j].date"
                            @click="pickDate(i * 7 + j)">{{date[i * 7 + j] && date[i * 7 + j].text}}</td>
                    </tr>
                </tbody>
            </table>
            <!-- 年-月 -->
            <table 
                class="date-picker date-picker2"  
                v-if="format == 'YYYY-MM'"
            >
                <thead>
                    <tr class="date-head date-head2">
                        <th colspan="6">
                            <span class="btn-prev" @click="yearClick(-1)">&lt;</span>
                            <span class="show-year">{{now.getFullYear() + ' 年'}}</span>
                            <span class="btn-next" @click="yearClick(1)">&gt;</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(v, i) in 6" :key="i">
                        <td v-for="(v, j) in 2"
                            colspan="3"
                            :key="j"
                            :class="flag == (i * 2 + j) ? (showFlag && 'date-active') : ''"
                            @click="pickMonth(i * 2 + j)"
                        >
                            {{months[i * 2 + j]}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
/*子组件调用方法: 
    1、<datepicker value="" format="YYYY-MM-DD" vid="begin" name="1"></datepicker>

    2、<datepicker value="2019-01-06" format="YYYY-MM-DD"  vid="end" name="2"></datepicker>

    参数说明: 看下方prop对象说明
*/
export default {
    props: {
        readonly: { type: Boolean, default: false },  //是否设置为不可选
        value: { type: String, default: '' },  //默认值,不传则默认当天日期
        format: { type: String, default: 'YYYY-MM-DD' },  //日期格式  'YYYY-MM-DD' 或 "YYYY-M-D"等
        name: { type: String, default: '' }, //输入框的name
        inputstyle: [Object, Array],   //自定义输入框样式
        inputclass: [Object, Array],   //自定义输入框class
        vid: { type: String, default: '' }   //输入框id
    },
    data () {
        return {
            show: false,
            days: ['日', '一', '二', '三', '四', '五', '六'],
            months: ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'],
            date: [],
            now: new Date(),
            pickedValue: '',
            pickedId: '',

            showFlag: true,
            flag: '',
            y: ''
        }
    },
    watch: {
        now () {
          this.update()
        },
        show () {
          this.update()
        }
    },
    methods: {
        close () {
            this.show = false
        },
        update () {
            var arr = []
            var time = new Date(this.now)
            time.setMonth(time.getMonth(), 1) // the first day
            var curFirstDay = time.getDay()
            curFirstDay === 0 && (curFirstDay = 7)
            time.setDate(0) // the last day
            var lastDayCount = time.getDate()
            for (let i = curFirstDay; i > 0; i--) {
                arr.push({
                    text: lastDayCount - i + 1,
                    time: new Date(time.getFullYear(), time.getMonth(), lastDayCount - i + 1),
                    status: 'date-pass'
                })
            }
            time.setMonth(time.getMonth() + 2, 0) // the last day of this month
            var curDayCount = time.getDate()
            time.setDate(1) // fix bug when month change
            var value = this.pickedValue || this.stringify(new Date())
            for (let i = 0; i < curDayCount; i++) {
                let tmpTime = new Date(time.getFullYear(), time.getMonth(), i + 1)
                let status = ''
                this.stringify(tmpTime) === value && (status = 'date-active')
                arr.push({
                    text: i + 1,
                    time: tmpTime,
                    status: status
                })
            }
            var j = 1
            while (arr.length < 42) {
                arr.push({
                    text: j,
                    time: new Date(time.getFullYear(), time.getMonth() + 1, j),
                    status: 'date-future'
                })
                j++
            }
            this.date = arr
        },
        yearClick (flag) {
            this.now.setFullYear(this.now.getFullYear() + flag)
            if(this.y != this.now.getFullYear()){
                this.showFlag = false;
            }else{
                this.showFlag = true;
            }
            this.now = new Date(this.now)
        },
        monthClick (flag) {
            this.now.setMonth(this.now.getMonth() + flag, 1)
            this.now = new Date(this.now)
        },
        pickDate (index) {
            this.show = false
            this.now = new Date(this.date[index].time)
            this.pickedValue = this.stringify()
        },
        pickMonth (flag){
            this.show = false
            this.now.setMonth(flag);
            this.now = new Date(this.now);
            this.pickedValue = this.stringify()

            this.flag = flag;
            this.y = this.now.getFullYear();
            this.showFlag = true;
        },
        parse (str) {
            var time = new Date(str)
            return isNaN(time.getTime()) ? null : time
        },
        stringify (time = this.now, format = this.format) {
            var year = time.getFullYear()
            var month = time.getMonth() + 1
            var date = time.getDate()
            var _this = this;
            var monthName = this.months[time.getMonth()]
            var map = {
                YYYY: year,
                MMM: monthName,
                MM: ('0' + month).slice(-2),
                M: month,
                DD: ('0' + date).slice(-2),
                D: date
            }
            return format.replace(/Y+|M+|D+/g, function (str) {
                return map[str]
            })
        },
        leave (e) {
            if(!this.$el.contains(e.target)) {
                this.close()
            }
        }
    },
    mounted () {
        if(this.value){
            this.pickedValue = this.value;

            //初始化定义选中
            var arr = this.value.split('-')
            this.y = arr[0];
            this.flag = arr[1] * 1 - 1;

        }else{
            this.pickedValue = this.stringify(new Date());

            //初始化定义选中
            this.y = new Date().getFullYear();
            this.flag = new Date().getMonth();
        }
        this.$nextTick(() => {
            this.now = this.value ? this.parse(this.pickedValue) : new Date();
            document.addEventListener('click', this.leave)
        })
    },
    beforeDestroy () {
        document.removeEventListener('click', this.leave)
    }
};
</script>

<style scoped>
.datetime-picker {
    position: relative;
    top: -2px;
    display: inline-block;
    font-family: "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei";
    -webkit-font-smoothing: antialiased;
    color: #333;
}
.datetime-picker * {
    box-sizing: border-box;
}
.datetime-picker input {
    width: 100px;
    padding: 5px 10px;
    height: 27px;
    outline: 0 none;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 14px;
    cursor:pointer;
    color: #606266;
}
.datetime-picker .picker-wrap {
    position: absolute;
    z-index: 1000;
    width: 238px;
    height: 280px;
    margin-top: 4px;
    background-color: #fff;
    box-shadow: 0 0 6px #ccc;
}
.datetime-picker table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    text-align: center;
    font-size: 13px;
}
.datetime-picker tr {
    height: 34px;
    border: 0 none;
}
.datetime-picker .date-picker2 tr {
    height: 40px;
    border: 0 none;
}
.datetime-picker th, .datetime-picker td {
    user-select: none;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 0 none;
    line-height: 34px;
    text-align: center;
}
.datetime-picker td {
    cursor: pointer;
}
.datetime-picker td:hover {
    background-color: #b6e1f79e;
}
.datetime-picker td.date-pass, .datetime-picker td.date-future {
    color: #aaa;
}
.datetime-picker td.date-active {
    background-color: #3bb4f2;
    color: #FFF;
}
.datetime-picker .date-head {
    background-color: #3bb4f2;
    text-align: center;
    color: #fff;
    font-size: 14px;
}
.datetime-picker .date-days {
    color: #3bb4f2;
    font-size: 14px;
}
.datetime-picker .show-year {
    display: inline-block;
    min-width: 62px;
    vertical-align: middle;
}
.datetime-picker .show-month {
    display: inline-block;
    min-width: 28px;
    vertical-align: middle;
}
.datetime-picker .btn-prev,
.datetime-picker .btn-next {
    cursor: pointer;
    display: inline-block;
    padding: 0 10px;
    vertical-align: middle;
}
.datetime-picker .date-head2 .btn-prev,
.datetime-picker .date-head2 .btn-next {
    cursor: pointer;
    display: inline-block;
    padding: 0 15px;
    margin: 0 20px;
    vertical-align: middle;
}
.datetime-picker .btn-prev:hover,
.datetime-picker .btn-next:hover {
    background: rgba(16, 160, 234, 0.5);
}
</style>
