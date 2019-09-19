
let state = { 
	chooseCarInfo:{},
	indexSSSSID:'', // 首页的id
	isNewLocation:false // 是否获取了定位
}
let getters = { 
	getCarInfo(state){
		return state.chooseCarInfo
	},
	getIndexStoreId(state){
		return state.indexSSSSID
	},
	getIsLocation(state){
		return state.isNewLocation
	}
} 
let mutations = {
	// 设置车型选择后的数据
	setCarInfo(state,data){ 
		state.chooseCarInfo = Object.assign(state.chooseCarInfo,data) 
	},
	// 将已选好的车型置空
	setCarInfoNull(state){
		state.chooseCarInfo = {}
	},
	// 设置首页门店id
	setIndexStoreId(state,id){
		state.indexSSSSID = id
	},
	// 完成获取位置
	authLocation(){
		state.isNewLocation = true
		
	}
	
}
let actions = {
	
}

export default {
	state,
	mutations,
	getters,
	actions
}
