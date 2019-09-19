<template>
	<view class="wrapper">
		<view class="tip">我们将对您的爱车信息进行严格的保密，请放心填写</view>

		<view class="car-info">

			<view class="car-brand">
				<view class="title">品牌车型</view>
				<view class="content flex-between" @click="openCarBrand">
					<text v-show="carInfo.vehicle_type_id == ''">请选择品牌车型 </text>
					<text class="full" v-show="carInfo.vehicle_type_id!=''">{{carInfo.brand_name}}-{{carInfo.series_name}}-{{carInfo.vehicle_type_name }} </text>
					<image class="icon" src="/static/user/a-l-d.png" mode=""></image>
				</view>
			</view>
			<view class="xiline"></view>
			<view class="car-code">
				<view class="title">车牌号码</view>
				<view class="content flex-between">
					<view class="flex-start" @click="switchProCode">
						<text>{{proCode || '省'}}</text>
						<image class="icon" src="/static/user/drop.png" mode=""></image>
					</view>
					<input type="text" confirm-type="done" maxlength="7" v-model="carCode"  placeholder="请输入车牌号" placeholder-class="place-style" />
				</view>
			</view>
			<view class="xiline"></view>
			<view class="gls">
				<view class="title">行驶里程</view>
				<view class="content flex-start">
					<input maxlength="6" type="number" v-model="glCount" placeholder="请输入里程数" placeholder-class="place-style" />
					<text>KM</text>
				</view>
			</view>
		</view>
		<view class="gap"></view>
		<view class="insurance">
			<view class="title">保险到期时间</view>
			<view class="flex-start">
				<picker mode="date" @change="changeDate" :value="dateVelue">
					<view :class="dateValue==''?'no-data':''">{{dateValue||'请选择保险到期时间'}}</view>
				</picker>
				<image class="icon" src="/static/user/a-l-d.png" mode=""></image>
			</view>
			<view class="xiline"></view>
		</view>

		<view class="btn-area">
			<view class="btn" @click="saveInfo()">保存</view>
		</view>
		<!-- 省份简称模块 -->
		<pro-code :show="showProCode" @hideProCode="listentHideProCode" @getPro="chooseProd"></pro-code>
	</view>
</template>

<script>
	var isVehicleNumber = function(vehicleNumber) {
		var xreg = /^[A-Z]{1}(([A-HJ-NP-Z0-9]{5}[DF]{1}$)|([DF]{1}[A-HJ-NP-Z0-9]{5}$))/;
		var creg = /^[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
		if (vehicleNumber.length == 6) {
			return creg.test(vehicleNumber);
		} else if (vehicleNumber.length == 7) {
			return xreg.test(vehicleNumber);
		} else {
			return false;
		}
	}
	import proCode from "../../../components/province-code/province-code.vue"
	import {
		singleCar,
		editCar,
		addCar,
		user
	} from "../../../api/user.js"
	import {getProvince} from "../../../api/home/index.js"
	import {
		mapGetters,
		mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				id: '', // 编辑的车辆id 没有说明是新添加车辆
				showProCode: false, // 是否显示省简介
				proCode: '',
				carCode: '', // 车牌号
				glCount: '', // 公里数
				dateValue: "", // 保险到期时间
				carInfo: {
					brand_name: '',
					vehicle_type_id: '',
					series_name: "",
					vehicle_type_name: ''
				},
				fromPage:'' // 从哪个页面来的
			}
		},
		components: {
			proCode
		},
		computed: {
			...mapGetters(['getCarInfo'])
		},
		onLoad(option) {
			uni.hideShareMenu() 
			this.id = option.id || '' 

			this.fromPage = option.fromPage || ''
			this.getCarInfos() 
			if(this.id == '') {
				this.getUserInfo()
			} else {
				uni.setNavigationBarTitle({
					title:'编辑车辆'
				})
			}
		},
		onUnload() {
			this.setCarInfoNull()
		},
		onShow() {
			if (this.getCarInfo.vehicle_type_id != '' && this.getCarInfo.vehicle_type_id) {
				this.carInfo.brand_name = this.getCarInfo.brand_name
				this.carInfo.vehicle_type_id = this.getCarInfo.vehicle_type_id
				this.carInfo.series_name = this.getCarInfo.series_name
				this.carInfo.vehicle_type_name = this.getCarInfo.vehicle_type_name
			}
		},
		watch: {
			carCode(v) {
				let code = v.toUpperCase()

				this.carCode = code
			}
		},
		methods: {
			...mapMutations(['setCarInfoNull']),

			// 获取个人信息
			getUserInfo(){ 
				user().then(res=>{
					if(res.data.code == 0) {
						if(res.data.result.user_info.mobile) {
							getProvince({
								data:{
									sub_code: res.data.result.user_info.mobile
								}
							}).then(resu=>{
								if(resu.data.code == 0) {
									this.proCode = resu.data.result.car_num_prefix[0]
									this.carCode = resu.data.result.car_num_prefix[1]
								}
							})
						}
					}
				})
			},
			// 获取单个车的信息
			getCarInfos() {
				if (this.id == '') return
				singleCar({
					data: {
						id: this.id
					}
				}).then(res => {
					if (res.data.code == 0) {
						let carInfo = res.data.result.user_car
						this.carInfo = carInfo
						if(carInfo.car_no){
							this.proCode = carInfo.car_no[0]
							this.carCode = carInfo.car_no.substring(1, carInfo.car_no.length)
						} else {
							this.getUserInfo()
						} 
						if(carInfo.insure_expire_time && carInfo.insure_expire_time.length > 10) {
							carInfo.insure_expire_time = carInfo.insure_expire_time.substring(0,10)  
						}
						this.dateValue = carInfo.insure_expire_time  
						if(carInfo.mileage <= 0) { 
							this.glCount = ''
						} else if (carInfo.mileage.length > 6) {
							this.glCount = carInfo.mileage.substring(0,6)
						} else {
							this.glCount = carInfo.mileage
						}
					}
				})
			},
			switchProCode() {
				this.showProCode = true
			},
			listentHideProCode() {
				this.showProCode = false
			},
			changeDate(e) {
				this.dateValue = e.detail.value
			},
			// 打开车品牌
			openCarBrand() {
				uni.navigateTo({
					url: '/pages/user/car-brand/car-brand'
				})
			},
			// 选择省份简介
			chooseProd(v) {
				this.proCode = v
				this.listentHideProCode()
			},
			// 保存信息
			saveInfo() {
				if (this.carInfo.vehicle_type_id == "" || !this.carInfo.vehicle_type_id) {
					uni.showToast({
						title: "请选择品牌车型",
						icon: "none"
					})
					return
				}
				if (this.proCode == '') {
					uni.showToast({
						title: "请选择车牌归属地",
						icon: "none"
					})
					return
				}
				if (!isVehicleNumber(this.carCode)) {
					uni.showToast({
						title: '请输入正确的车牌号',
						icon: "none"
					})
					return
				}
				if(this.glCount!='' &&  this.glCount<= 0) {
					uni.showToast({
						title: '公里数必须大于0',
						icon: "none"
					})
					return
				}
				if (this.id == '') {
					uni.showLoading({
						title:'提交中...',
						mask:true
					}) 
					// 添加车辆
					addCar({
						data: {
							car_no: this.proCode + this.carCode,
							vehicle_type_id: this.carInfo.vehicle_type_id,
							mileage: this.glCount,
							insure_expire_time: this.dateValue
						}
					}).then(res => { 
						if (res.data.code == 0) {
							uni.showToast({
								title: '添加成功',
								icon: "none"
							})
							if(this.fromPage == 'by') {
								let pages = getCurrentPages()
								pages[pages.length-2].$vm.carId = res.data.result.car_id
							} 
							setTimeout(() => {
								uni.hideLoading()
								uni.navigateBack()
							}, 500)
						}
					})
				} else {
					uni.showLoading({
						title:'提交中...',
						mask:true
					}) 
					// 编辑车辆
					editCar({
						data: {
							id: this.id,
							car_no: this.proCode + this.carCode,
							vehicle_type_id: this.carInfo.vehicle_type_id,
							mileage: this.glCount,
							insure_expire_time: this.dateValue
						}
					}).then(res => {
						
						if (res.data.code == 0) {
							uni.showToast({
								title: "编辑成功",
								icon: 'none'
							})
							setTimeout(() => {
								uni.hideLoading()
								uni.navigateBack()
							}, 500)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	@import './add-car.scss'
</style>
