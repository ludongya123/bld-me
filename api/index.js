import {format} from '../util/util.js'
import  {loginAction} from "../util/login.js"
let showReLogin = true // 防止多次弹起登录
let host1 = '';
let host2 = "";  
let host3 = '';
let host4 = '';
if(process.env.NODE_ENV === 'development'){ 
	host1 = "https://cte2-erp.car-me.com/"; // 开发环境新接口
	host2 = "https://cte2-carmall.car-me.cn/"; // 开发环境老接口 
	host3 = "http://192.168.51.101:9080/mockjsdata/6/"
	host4 = 'http://dev3.carmall.car-me.cn/'
}else{ 
	host1 = "https://cte2-erp.car-me.com/"; // 开发环境新接口
	host2 = "https://cte2-carmall.car-me.cn/"; // 开发环境老接口 
}

let hostMain = ''

const getComData = (sign, signDate, loginFlag) => {
	let comData = null;
	// let lat = getApp().globalData.latitude + '';
	// let lon = getApp().globalData.longitude + '';
	if(loginFlag == 1) {
		comData = {
			version:'0.0.1', 
			client_id:'wx',
			client_token:'wx_001',
			user_token:'',
			timestamp: format(signDate)
		}
	} else {
		comData = {
			 version:'0.0.1', // 版本号，写死
			 client_id:'wx', // 客户端来源，写死
			 client_token:'wx_001', // 用户唯一设备号
			 timestamp: format(signDate), // 时间戳
			 client_idfa:'123456', // 写死
			 client_version:'123456', // 写死
			 latitude:  '' , // 纬度
			 longitude:  '' , // 经度 
			 user_token: uni.getStorageSync('token') || ''
		}
	}
	
	if (sign != '-1') {
		comData['sign'] = sign;
	}
	return comData
}


export const http = (url, obj = {}) => {
	return new Promise((resolve, reject) => {
		let contentType = obj.contentType == 2 ? 'application/x-www-form-urlencoded' : 'application/json';

		// 先签名,签名成功后调用业务接口
		let signDate = new Date();
		let comData = getComData(-1, signDate, obj.isLogin)
		let lat = getApp().globalData.latitude + '';
		let lon = getApp().globalData.longitude + '';
		if(obj.isLogin != 1) {
			comData.latitude = lat
			comData.longitude = lon
		}
	
		uni.request({
			url: 'https://1788296382010961.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/common/sign/', // 请求地址
			data: Object.assign(obj.data || {}, comData),
			method: 'POST',
			success: function (res) {
				let comDataSign = getComData(res.data.result.signature, signDate, obj.isLogin)
				if(obj.isLogin != 1) {
					comDataSign.latitude = lat
					comDataSign.longitude = lon
				}
				if (obj.env == 'new' || !obj.env) {
					hostMain = host1
				}
				if (obj.env == 'old' ) {
					hostMain = host2
				}  
				if (obj.env == 'mock' ) {
					hostMain = host3
				} 
				if(obj.env == 'dev3' ) {
					hostMain = host4
				}
				uni.request({
					url: hostMain + url, //请求地址
					method: obj.method || "POST", //请求方式
					data: Object.assign(obj.data || {}, comDataSign), //请求参数
					header: {
						Accept:'application/json',
						"Content-Type": contentType
					},
					success: function(res) { 
						
						if(res.data.code != 0 && res.data.code != '100004' && res.data.code != '100012') {
							uni.showToast({
								title: res.data.message,
								icon: 'none',
								duration: 3000
							})
						}
						if(res.data.code == '100012') {
							uni.showModal({
								title:'提示',
								content:res.data.message,
								showCancel:false,
								confirmText:'我知道了',
								confirmColor:"#B49A83",
								success() {
									uni.hideLoading()
								}
							})
						}
						
						if(res.data.code == '100004' && showReLogin) {
							console.log('过期')
							showReLogin = false
							uni.showModal({
								title:'过期提醒',
								content:"登录已过期，请重新登录",
								showCancel:false,
								success() {
									showReLogin = true
									uni.removeStorageSync('token')
									loginAction().then((res )=>{ 
										if(res.isMobile == 1) {
											uni.reLaunch({
												url:"/pages/home/home"
											})
										} else {
											uni.navigateTo({
												url:'/pages/login/login'
											})
										}
										
									})
								}
							})
							
						}
						resolve(res)
					},
					fail: function(err) { 
						if(err.errMsg == 'request:fail timeout') {
							uni.showToast({
								title:'网络请求超时，请稍后重试',
								icon:'none'
							})
						}console.log(err)
						reject(err)
					}
				});
			},
			fail: function(err) {
				console.log(err)
				if(err.errMsg == 'request:fail timeout') {
					uni.showToast({
						title:'网络请求超时，请稍后重试',
						icon:'none'
					})
				}
				reject(err)
			}
		})
		
	})
}
