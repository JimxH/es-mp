//定义错误码集合
const errorCode = {


	'ss0000': '成功'
}

//导出结果
export default function(code){
	return errorCode[code]　? errorCode[code] : '';
}