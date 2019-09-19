import {http} from './index.js'

//登录
export const login = params => {
	return http('rest/user/authorizedLogin.json',params)
}
// 热门车型
export const hotCar = params => {
	return http('rest/carinfo/hotBrand.json',params) 
}
// 获取车品牌
export const carType = params => {
	return http('rest/carinfo/brand.json',params)
}
// 获取某一品牌的车系
export const brandStyle = params => {
	return http('rest/carinfo/series.json',params)
}
// 获取某一车系的车型价格  
export const carVehicleType = params => {
	return http('rest/carinfo/vehicleType.json',params)
}
// 车辆图标
export const carIcon = "https://carbrand.car-me.com/"
// 获取用户中心首页信息
export const user = (params={}) =>{ 
	return http('rest/user/index.json', params  )
}
// 用户余额
export const balance = params => {
	return http('rest/wallet/getBalanceWallet.json',params)
}
// 获取绑定项目
export const bindProduct = params => {
	return http('rest/wallet/getItems.json',params)
}
// 获取优惠券
export const tickets = params => {
	return http('rest/wallet/getDetail.json',params)
}
// 获取用户车辆
export const userCar = params => {
	return http('rest/userautocar/getCarPage.json',params)
}
// 获取车辆售后信息
export const afterSale = params => {
	return http('rest/userautocar/carInfoAndRecords.json',params)
}
// 获取售后详情
export const afterSaleDetail = params=>{
	return http('rest/userautocar/afterSalesDetail.json',params)
}
// 删除车辆
export const delCar = params => {
	return http('rest/userautocar/delCar.json',params)
}
// 设置默认车辆
export const setDefaultCar = params => {
	return http('rest/userautocar/setDefaultCar.json',params)
}
// 获取默认车辆
export const defaultCar = params => {
	return http('rest/userautocar/getDefaultCar.json',params)
}
// 获取单个车辆信息
export const singleCar = params => {
	return http('rest/userautocar/getUserAutocarById.json' ,params)
}
// 编辑车辆
export const editCar = params => {
	return http('rest/userautocar/editCar.json',params)
}
// 添加车辆
export const addCar = params => {
	return http('rest/userautocar/addCar.json',params)
}
// 获取实时数据
export const liveData = params => {
	return http('rest/obd/getCarObd.json',params)
}
// 获取提醒设置
export const noticeSetting = params => {
	return http('rest/obd/getTypeList.json',params)
}
// 更改异常提醒设置
export const changeNoticeSetting = params => {
	return http('rest/obd/updateErrorState.json',params)
}
// 获取异常提醒信息列表
export const noticeList = params => {
	return http('rest/obd/getErrorInfoList.json',params)
}
// 实时油耗
export const oilConsumption = params => {
	return http('rest/obd/getDriveHistoryList.json',params)
}
// 驾驶分析 （日）
export const driveDay = params => {
	return http('rest/obd/getDriveHistoryDay.json',params)
}
// 驾驶分析 （月）
export const driveMonth = params => {
	return http('rest/obd/getDriveHistoryMonth.json',params)
}
// 获取obd安装的时间
export const obdInstall = params => {
	return http('rest/obd/getCreatedDate.json',params)
}
// 获取车辆定位信息
export const obdLocation = params => {
	return http('rest/obd/getDeviceGps.json',params)
}

// 获取我的评价列表
export const mySuggest = params => {
	return http('rest/feedback/getFeedbackList.json',params)
}
// 删除我的意见反馈
export const deleteSuggest = params => {
	return http('rest/feedback/delFeedback.json',params)
}
// 意见反馈详情
export const suggestDetail = params => {
	return http('rest/feedback/feedbackDetail.json',params)
}
// 获取门店信息
export const shopDetail = params =>{
	return http('rest/store/getStoreDetail.json',params)
}
//提交或重新编辑反馈意见
export const subSuggest = params => {
	return http('rest/feedback/submitFeedback.json',params)
}
// 获取oss授权
export const oss = params => {
	return http('rest/upload/ossSign.json',params)
}
// 获取预约列表
export const appoint = params => {
	return http('rest/reserve/page.json',params)
}
// 获取预约详情 rest/reserve/detail.json
export const appointDetail = params => {
	return http('rest/reserve/detail.json',params)
}
// 获取可切换客户列表 rest/user/customerList.json
export const customerList = params => {
	return http('rest/user/customerList.json',params)
}
// 用户切换客户主体 rest/user/switchCustomer.json
export const switchCustomer = params => {
	return http('rest/user/switchCustomer.json',params)
}
// 用户我的订单 /rest/order/myOrderPage.json//暂时使用这个接口测试等我的订单接口迁移完成后修改
export const myOrderPage = params => {
	return http('/rest/order/page.json',params)
}
// 用户我的订单详情 /rest/order/detail.json
export const myOrderDetail = params => {
	return http('rest/order/detail.json',params)
}
// 用户我的订单详情 rest/pay/wechat/get.json
export const myOrderPay = params => {
	return http('rest/pay/wechat/get.json',params)
}
// 用户物流详情 rest/wuliuxiangqing.json
export const logisticsDetail = params => {
	return http('rest/wuliuxiangqing.json',params)
}
// 用户获取退款详情 rest/refundinfo.json
export const refundinfoDetail = params => {
	return http('/rest/order/refundMessage.json',params)
}
// 用户申请退款 rest/order/refund.json
export const userRefund = params => {
	return http('rest/order/refund.json',params)
}

