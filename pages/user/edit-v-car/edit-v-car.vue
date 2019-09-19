<template>
	<view>
		<!-- 如果车辆已认证 -->
		<view class="my-v-car">
			<view class="bg"> </view>
			<view class="car-content">
				<view class="flex-start top">
					<image class="car-icon":src="carIcon+carInfo.brand_id+'.png'" mode=""></image>
					<view class="f-r-info">
						<view class="title flex-start">
							<text>{{carInfo.car_no}}</text>
							<image class="v-icon" src="/static/user/v.png" mode=""></image>
						</view>
						<view class="desc">{{carInfo.brand_name}} {{carInfo.series_name}} {{carInfo.vehicle_type_name}}</view>
					</view>
				</view>
				<view class="xiline"></view>
				<view class="btm">
					车辆信息有误？联系客服修改信息 400181888
				</view>
			</view>
		</view>
		<view class="form">
			<view class="form-g">
				<view class="label">行驶里程</view>
				<view class="flex-start">
					<input type="number" v-model="glCount" placeholder="请输入行驶里程" placeholder-class="place-style" />
					<text class="km">KM</text>
				</view>
			</view>
			<view class="xiline"></view>
			<view class="form-g">
				<view class="label">保险到期时间</view>
				<view class="flex-start">
					<picker mode="date" @change="changeDate" :value="dateValue">
						<view :class="dateValue==''?'no-data':''">{{dateValue || '请选择保险到期时间' }}</view>
					</picker>
					<image class="icon" src="/static/user/a-l-d.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="btn-area">
			<view class="btn" @click="saveInfo()">保存</view> 
		</view>
	</view>
</template>

<script>
	import {singleCar,editCar,carIcon} from "../../../api/user.js"
	export default {
		data() {
			return {
				carIcon:carIcon,
				id:'',
				dateValue: '',
				glCount:'',
				carInfo:{}
			}
		},
		onLoad(opt) {
			uni.hideShareMenu() 
			this.id = opt.id
			this.getCarInfos()
		},
		methods: {
			// 获取单个车的信息
			getCarInfos(){
				if (this.id == '') return 
				singleCar({
					data:{
						id:this.id
					}
				}).then(res=>{
					if(res.data.code == 0) {
						let carInfo = res.data.result.user_car
						this.carInfo = carInfo
						if(carInfo.insure_expire_time && carInfo.insure_expire_time.length > 10) {
							carInfo.insure_expire_time = carInfo.insure_expire_time.substring(0,10)  
						}
						this.dateValue = carInfo.insure_expire_time
						this.glCount = carInfo.mileage
					}
				})
			},
			changeDate(e) {
				console.log(e)
				this.dateValue = e.detail.value
			},
			saveInfo(){
				uni.showLoading({
					
				})
				editCar({
					data:{
						id:this.id,
						car_no:this.carInfo.car_no,
						vehicle_type_id:this.carInfo.vehicle_type_id,
						mileage:this.glCount,
						insure_expire_time:this.dateValue 
					}
				}).then(res=>{
					uni.hideLoading()
					if(res.data.code == 0) {
						uni.showToast({
							title:"编辑成功",
							icon:"none"
						})
						setTimeout(()=>{
							uni.navigateBack()
						},500)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "./edit-v-car.scss"
</style>
