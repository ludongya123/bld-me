import {
	http
} from '../index.js'

// wx_首页_首页
export const getIndexData = params => {
	return http('rest/index/init.json', params)
}

// 门店列表/rest/store/getStoreList.json
export const storeList = params => {
	return http('rest/store/getStoreList.json', params)
}

// 车辆列表 rest/userautocar/getCarPage.json
export const getCarList = params => {
	return http('rest/userautocar/getCarPage.json', params)
}

// 获取默认车辆 rest/userautocar/getDefaultCar.json
export const getDefaultCar = params => {
	return http('rest/userautocar/getDefaultCar.json', params)
}

// 保养可预约时间
export const getReserveTime = params => {
	return http('rest/store/getReserveTime.json', params)
}

// 预约接口 rest/reserve/create.json
export const createYy = params => {
	return http('rest/reserve/create.json', params)
}

// 获取代步车申请时间
export const getWalkCarTime = params => {
	return http('rest/walk/car/applyTime/get', params)
}

// 提交代步车预约
export const createWalkCar = params => {
	return http('rest/walk/car/apply', params)
}

// 呼叫道路救援 rest/roadRescue/callRescue.json
export const callRescue = params => {
	return http('rest/roadRescue/callRescue.json', params)
}

// 预约门店信息
export const reserveStore = params =>  {
	return http('rest/reserve/index.json',params)
}

// 获取页面的banner图片
export const banner = params => {
	return http('rest/storeFitment/banner.json',params)
}

// 根据手机号查找归属地
export const getProvince = params => {
	return http('rest/userautocar/carPrefixinfo.json',params)
}