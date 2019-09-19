import Vue from 'vue'
import {
	userCar
} from "../api/user.js"
export const format = (time, type) => {
	//shijianchuo是整数，否则要parseInt转换
	var time = new Date(time);
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	var d = time.getDate();
	d = d < 10 ? '0' + d : d;
	var h = time.getHours();
	h = h < 10 ? '0' + h : h;
	var mm = time.getMinutes();
	mm = mm < 10 ? '0' + mm : mm;
	var s = time.getSeconds();
	s = s < 10 ? '0' + s : s;
	if (!type) {
		return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
	}
	if (type == "day") {
		return y + '-' + m + '-' + d
	}
	if (type == "month") {
		return y + '-' + m
	}
}

// 根据经纬度获取地理位置名称
export const getLocationName = (location) => {
	return new Promise((resolve, reject) => {
		Vue.prototype.$qqmapsdk.reverseGeocoder({
			location: {
				latitude: location.latitude,
				longitude: location.longitude
			},
			success: function(res) {
				resolve(res)
			}
		})
	})
}

// 获取当前日期
export const getNowFormatDate = _ => {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate;
	return currentdate;
}
/**
 * 页面跳转的逻辑 
 * @option 携带的参数
 * @pageType 从那个页面跳转的 'home/login'
 */

export const goPage = (option, pageType) => {
console.log(option, pageType)
	let toPage = ''
	let flag = option.flag || '';
	let extra = option.extra || {}
	if(flag == '') {return}
	
	if (uni.getStorageSync('isMobile') != 1) {
		if (option.need_login == 1) {
			uni.navigateTo({
				url: `/pages/login/login`
			})
			return
		}
	}

	if (flag == 'by') { // 保养页面
		if (uni.getStorageSync('isMobile') != 1) {
			uni.navigateTo({
				url: '/pages/login/login'
			})
			return
		}
		let ssss_id = extra.ssss_id || option.sss_id

		userCar({
			data: {
				page_no: '1',
				page_size: '5'
			}
		}).then(res => {
			if (res.data.code == 0) {
				if (res.data.result.user_cars.length > 0) {
					toPage = `/pages/home/baoyang/baoyang?sss_id=${ssss_id}`;
				} else {
					toPage = '/pages/user/add-car/add-car'
				}
				uni.navigateTo({
					url: toPage
				})
			}
		})

	} else if (flag == 'hdxq') { // h5静态页面
		let url = encodeURIComponent(appendUrlParam(extra.link_url));
		toPage = `/pages/home/web-view/web-view?url=${url}&title=${extra.title}`
		uni.navigateTo({
			url: toPage
		})
	} else if (flag == 'login') { // 登录界面
		uni.navigateTo({
			url: '/pages/login/login'
		})
	} else if (flag == 'my') { // 个人中心
		uni.switchTab({
			url: '/pages/user/user'
		})
	} else if (flag == 'tel') { // 打电话 需要登录
		if (uni.getStorageSync('isMobile') != 1) {
			uni.navigateTo({
				url: '/pages/login/login'
			})
			return
		}
		uni.makePhoneCall({
			phoneNumber: extra.number
		})
	}if (flag == 'spfz'){ //商品分组
		
		toPage = `/pages/mall/goods-list/goods-list?categoryId=${extra.group_id}`
		uni.navigateTo({
			url: toPage
		})
		
	}else if (flag == 'spxq'){ //商品详情
	
		toPage = `/pages/mall/goods-detail/goods-detail?productId=${extra.product_id}`
		uni.navigateTo({
			url: toPage
		})
		
	}else if (flag == 'newcar'){ //新车
	
		toPage = `/pages/mall/newcar-list/newcar-list?storeId=${extra.store_id}`
		uni.navigateTo({
			url: toPage
		})
		
	} else {
		if (flag == 'rescue') { // 道路救援 需要登录
		
			toPage = `/pages/home/roadside/roadside?sss_id=${option.sss_id}`
			
		} else if (flag == 'dbc') { // 代步车 需要登录
		
			toPage = `/pages/home/dbc/dbc?sss_id=${option.sss_id}`;
			
		} else if (flag == 'suggest') { // 反馈建议 需要登录
		
			toPage = `/pages/user/submit-suggest/submit-suggest?sss_id=${option.sss_id}`;
			
		} else if (flag == 'cllb') { // 车辆列表 需要登录
		
			toPage = '/pages/user/my-car/my-car'
			
		} else if (flag == 'add_car') { // 添加车辆 需要登录
		
			let carId = extra.car_id || ''
			
			toPage = `/pages/user/add-car/add-car?id=${carId}`
			
		} else if (flag == 'balance') { // 我的余额 需要登录
		
			toPage = '/pages/user/user-equity/user-equity?index=0'
			
		} else if (flag == 'bindItem') { // 我的绑定项目 需要登录
		
			toPage = '/pages/user/user-equity/user-equity?index=1'
			
		} else if (flag == 'coupon') { // 我的优惠券 需要登录
		
			toPage = '/pages/user/user-equity/user-equity?index=2'
			
		} else if (flag == 'workorder_detail') { // 工单详情 需要登陆
		
			toPage = `/pages/user/sell-detail/sell-detail?id=${extra.workorder_id}`
			
		} else if (flag == 'reserve_detail') { // 预约详情 需要登录 
		
			toPage = `/pages/user/appointment-state/appointment-state?id=${extra.reserve_id}`
			
		}
		
		if (uni.getStorageSync('isMobile') != 1) {
			uni.navigateTo({
				url: '/pages/login/login'
			})
			return
		}
		uni.navigateTo({
			url: toPage
		})
	}
}


// 判断是否同意obd授权
export const isNotionObd = () => {
	return new Promise((resolve, reject) => {
		if (uni.getStorageSync('isNoticeObd')) {
			resolve()
		} else {
			uni.showModal({
				title: '提醒',
				content: '本功能需要获取您的车辆信息（包括基础数据和行驶数据）才能使用，BLD-me承诺不会将这些信息对外批露或向第三方提供。是否同意获取您的车辆信息？',
				showCancel: true,
				cancelColor: '#999',
				cancelText: '不同意',
				confirmText: '同意',
				success(r) {
					if (r.confirm) {
						uni.setStorageSync('isNoticeObd', 1)
						resolve()
					} else {
						reject()
					}
				}
			})
		}

	})
}
// 判断是登录过
export const isLogin = () => {
	let timeS1 = new Date().getTime()
	return new Promise((resolve, reject) => {
		let timer = setInterval(() => {
			let timeS2 = new Date().getTime()
			if (uni.getStorageSync('token')) {
				clearInterval(timer)
				timer = null
				resolve();
			}
			if (timeS2 - timeS1 > 10 * 1000) {
				clearInterval(timer)
				timer = null
				reject()
			}
		}, 50)
	})
}
// 转换成百度坐标系
export const gcj02tobd09 = (lng, lat) => {
	var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
	var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);

	var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);

	var bd_lng = z * Math.cos(theta) + 0.0065;

	var bd_lat = z * Math.sin(theta) + 0.006;

	return [bd_lng, bd_lat]
}
// 转换成腾讯坐标
export const bd09togcj02 = (bd_lon, bd_lat) => {

	var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

	var x = bd_lon - 0.0065;

	var y = bd_lat - 0.006;

	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);

	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);

	var gg_lng = z * Math.cos(theta);

	var gg_lat = z * Math.sin(theta);

	return [gg_lng, gg_lat]
}

//在url上面追加约定好的参数
export const appendUrlParam = (url) => {
	const queryParam=getUrlQueryParam(url);
	if(queryParam._append){
		//第一位如果是1,则追加appUserToken
		if(queryParam._append.length>0&&queryParam._append.substr(0, 1)==1){
			//已登录且已绑定手机，则追加appUserToken
			if(uni.getStorageSync('token')&&uni.getStorageSync('isMobile')==1){
				if(url.indexOf('?')!=-1){
					url=url+"&appUserToken="+uni.getStorageSync('token');
				}else{
					url=url+"?appUserToken="+uni.getStorageSync('token');
				}
			}
		}
		//第二位如果是1,则追加ssssId
		if(queryParam._append.length>1&&queryParam._append.substr(1, 1)==1){
			//已登录且已绑定手机，则追加appUserToken
			if(uni.getStorageSync('ssssId')){
				if(url.indexOf('?')!=-1){
					url=url+"&ssssId="+uni.getStorageSync('ssssId');
				}else{
					url=url+"?ssssId="+uni.getStorageSync('ssssId');
				}
			}
		}
		
		//第三位如果是1,则追加sourceFrom
		if(queryParam._append.length>2&&queryParam._append.substr(2, 1)==1){
			//已登录且已绑定手机，则追加appUserToken
			if(url.indexOf('?')!=-1){
				url=url+"&sourceFrom=wxMiniProgram"
			}else{
				url=url+"?sourceFrom=wxMiniProgram"
			}
		}
		
	}
	return url;
}

export const getUrlQueryParam = (url) => {
	let query = url.split('?');
	query = query.length > 1 ? query[1].split('&') : []

	let json = {}
	for (let i = 0, len = query.length; i < len; i++) {
		let key = query[i].split('=')[0],
			index = query[i].indexOf('='),
			value = query[i].substr(index + 1);
		json[key] = value;
	}
	return json;
}

