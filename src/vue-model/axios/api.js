
//子组件内调用： this.api.user.login

//判断环境，输出接口路径 development为开发环境
const dev = (process.env.NODE_ENV == 'development') ? true : false;

//定义url接口(开发本地数据接口，生产接口)
export default {
	user: {
		//登录
        login: dev 
        	? '/static/devTest/user/login.json' 
        	: '/msc/mp/login/merchant-login',

        // 退出登录
        loginOut: dev 
        	? '/static/devTest/user/default.json' 
        	: '/manage/company/loginOut',

        //商家菜单列表
        menuList: dev 
        	? '/static/devTest/user/menuList.json' 
        	: '/msc/mp/menu/menu-list',

        //商家默认信息 
        statisticsInfo: dev 
        	? '/static/devTest/user/statisticsInfo.json' 
        	: '/msc/mp/info/mp-statistics-info',

        //商家基本信息 
        baseInfo: dev 
        	? '/static/devTest/user/baseInfo.json' 
        	: '/msc/mp/info/mp-base-info',

        //修改密码 
        password: dev 
        	? '/static/devTest/user/default.json' 
        	: '/msc/mp/info/mp-modify-password',

        //修改预警次数 
        warncount: dev 
        	? '/static/devTest/user/default.json' 
        	: '/msc/mp/info/mp-modify-warncount'
    },
    payment: {
    	//违章查询流水列表
    	flow: dev 
    		? '/static/devTest/payment/flow.json' 
    		: '/msc/mp/tpinfo/query-trafficpenaltycoad',

    	//违章流水导出
    	export: dev 
    		? '/static/devTest/user/default.json' 
    		: '/msc/mp/tpinfo/export-trafficpenaltycoad',

    	//违章统计流水
    	queryStatistic: dev 
    		? '/static/devTest/payment/queryStatistic.json' 
    		: '/msc/mp/tpinfo/query-statisticcoad',

    	//违章统计导出
    	exportStatistic: dev 
    		? '/static/devTest/user/default.json' 
    		: '/msc/mp/tpinfo/export-statisticcoad'
    },
    violation: {
    	//订单列表查询
    	qyOrdList: dev 
    		? '/static/devTest/violation/qyOrdList.json' 
    		: '/msc/mp/tporder/query-tp-order',

    	//导出订单列表
    	expOrdList: dev 
    		? '/static/devTest/user/default.json' 
    		: '/msc/mp/tporder/query-tp-order',

    	//违章订单统计
    	tpStatistic: dev 
    		? '/static/devTest/violation/tpStatistic.json' 
    		: '/msc/mp/tporder/statistic-tp-order',

    	//违章订单统计导出
    	exportTpStatistic: dev 
    		? '/static/devTest/user/default.json' 
    		: '/msc/mp/tporder/export-statistic-tporder',

    	//代缴分润统计查询
    	profitStatistic: dev 
    		? '/static/devTest/violation/profitStatistic.json' 
    		: '/msc/mp/tppfofit/statistic-tp-pfofit',

    	//代缴分润统计导出
    	exportProfitStatistic: dev 
    		? '/static/devTest/user/default.json' 
    		: '/msc/mp/tporder/export-statistic-tppfofit',

    	//代缴分润统计订单导出
    	exportProfitStatisticOrder: dev 
	    	? '/static/devTest/user/default2.json'
	    	: '/msc/mp/tporder/expor–profit-tporder',

    	//代缴分润记录查询
    	profitRecord: dev 
    		? '/static/devTest/violation/profitRecord.json' 
    		: '/msc/mp/tppfofit/query-pfofit-record',

    	//代缴分润记录订单详情
    	profitRecordDetail: dev 
    		? '/static/devTest/violation/profitRecordDetail.json' 
    		: '/msc/mp/tporder/ query-pfofit-detail'
    }
}
