import {
	http
} from "./index.js"
const mock = {env:'mock'}
const dev3 = {env: 'dev3'}
// 获取商品分组
export const category = params => { 
	return http('rest/product/categories.json', params)
}
// 获取商品列表
export const goodsList = params => {
	return http('rest/product/list.json', params)
}
// 商品详情
export const goodsDetail = params => {
	return http('rest/product/detail.json',params)
}
// 获取新车车辆列表
export const newCarList = params => { 
	return http('rest/motorama/queryPage.json', params)
}
// 新车详情
export const newCarDetail = params => {
	return http('rest/motorama/detail.json',params)
}
// 低价咨询
export const ziXun = params => {
	return http('rest/driveAppointment/enquiry.json',params)
}
// 可预约试驾的时间
export const reserveTime = params => {
	return http('rest/motorama/getReserveTime.json',params)
}
// 预约试驾
export const testDriver = params => {
	return http('rest/driveAppointment/drive.json',params)
}
// 车辆配置
export const carConfig = params => {
	return http('rest/common/carInfo.json',params )
}
// 获取省市区
export const region = params => {
	return http('rest/common/regionInfo.json',params)
}
// 添加地址
export const addAddress = params => {
	return http('rest/userAddress/add.json', params)
}
// 编辑地址
export const editAddress = params => {
	return http('rest/userAddress/edit.json',params )
}
// 编辑地址
export const deleteAddress = params => {
	return http('rest/userAddress/del.json',params )
}
// 收货地址列表
export const addressList = params => {
	return http('rest/userAddress/page.json',params)
}
// 地址详情
export const addressDetail = params => {
	return http('rest/userAddress/detail.json',params)
}
// 获取欲下订单的详情
export const preOrderDetail = params => {
	return http('rest/order/submit.json',params)
}
// 提交订单
export const createOrder = params => {
	return http('rest/order/create.json',params)
}
// 支付
export const payOrder = params => {
	return http('rest/pay/wechat/get.json',params)
}