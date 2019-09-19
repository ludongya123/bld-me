<template>
	<view >
		<view class="title flex-start">
			<text class="argu">参数</text>
			<text class="val">数值</text>
			<text class="reference">参考值</text>
		</view>
		<view class="xiline"></view>
		<view class="flex-start">
			<text class="argu">当前车速</text>
			<text class="val">{{info.speed}}</text>
			<text class="reference">0~255(km/h)</text>
		</view>
		<view class="xiline"></view>
		<view class="flex-start">
			<text class="argu">引擎转速</text>
			<text class="val">{{info.engine_revs}}</text>
			<text class="reference">0-7000(r/min)</text>
		</view>
		<view class="xiline"></view>
		<view class="flex-start">
			<text class="argu">引擎水温</text>
			<text class="val">{{info.engine_water_temperature}}</text>
			<text class="reference">-30~130(°C)</text>
		</view>
		<view class="xiline"></view>
		<view class="flex-start">
			<text class="argu">里程</text>
			<text class="val">{{info.cur_mileage}}</text>
			<text class="reference">公里</text>
		</view>
		<view class="xiline"></view>
		<view class="flex-start">
			<text class="argu">电瓶电压</text>
			<text class="val">{{info.battery_voltage}}</text>
			<text class="reference">11.5~15(V)</text>
		</view>
		<view class="xiline"></view>
		<view class="flex-start">
			<text class="argu">控制模块电压</text>
			<text class="val">{{info.control_model_voltage}}</text>
			<text class="reference">12~15(V)</text>
		</view>
		<view class="xiline"></view>
		<view class="flex-start">
			<text class="argu">车辆故障灯</text>
			<text class="val">{{info.light_error_status == 1?'开':'关'}}</text>
			<text class="reference">开-关</text>
		</view>
		<view class="xiline"></view>
		<view class="flex-start">
			<text class="argu">故障下行驶距离</text>
			<text class="val">{{info.light_error_mileage}}</text>
			<text class="reference">公里</text>
		</view>
	</view>
</template>

<script>
	import {liveData} from "../../../api/user.js"
	export default {
		data(){
			return {
				id:'',
				info:{}
			}
		},
		onLoad(opts) {
			uni.hideShareMenu() 
			this.id = opts.carId
			this.getLiveData()
		},
		methods:{
			getLiveData(){
				uni.showLoading()
				liveData({
					data:{
						car_id:this.id
					}
				}).then(res=>{
					uni.hideLoading()
					if(res.data.code == 0) {
						this.info = res.data.result.car_obd
					}
				})
			}
			
		}
	}
</script>

<style lang="scss">
	@import "./car-livedata.scss"
</style>
