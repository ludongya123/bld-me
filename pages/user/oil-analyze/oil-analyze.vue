<template>
	<view class="wrapper">
		<view class="top flex-start">
			<view class="f-l">
				<view class="tip">本日行驶里程</view>
				<view class="data" v-show="dayObj.distance">{{dayObj.distance}} <text>km</text></view>
				<view class="data" v-show="!dayObj.distance">--</view>
			</view>
			<view class="f-r">
				<view class="tip">本日油耗</view>
				<view class="data" v-show="dayObj.total_oil">{{dayObj.total_oil}} <text>L</text></view>
				<view class="data" v-show="!dayObj.total_oil">--</view>
			</view>
		</view>
		<view class="btm">
			<view class="tit">本次平均油耗</view>
			<view class="total-val" v-show="currObj.average_oil">{{currObj.average_oil}}<text>L</text>/<text>100km</text></view>
			<view class="total-val" v-show="!currObj.average_oil">--</view> 
			<view class="top-copy flex-start">
				<view class="f-l">
					<view class="tip">本次行驶里程</view>
					<view class="data" v-show="currObj.distance">{{currObj.distance}} <text>km</text></view>
					<view class="data" v-show="!currObj.distance">--</view>
				</view>
				<view class="f-r">
					<view class="tip">本次油耗</view>
					<view class="data" v-show="currObj.total_oil">{{currObj.total_oil}} <text>L</text></view>
					<view class="data" v-show="!currObj.total_oil">--</view>
				</view>
			</view>
			<view class="xiline"></view>
			<view class="time flex-between">
				<text>启动时间 {{currObj.begin_date || "--"}}</text>
				<text>熄火时间 {{currObj.end_date || '--'}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {oilConsumption,driveDay} from "../../../api/user.js"
	import {format} from "../../../util/util.js"
	export default {
		data(){
			return {
				id:'' ,// 车id
				currObj:{},
				dayObj:{}
			}
		},
		onLoad(opts) {
			uni.hideShareMenu() 
			this.id = opts.carId
			this.getOil()
			this.getDayOil()
		},
		methods:{
			getOil(){
				oilConsumption({
					data:{
						car_id:this.id
					}
				}).then(res=>{
					if(res.data.code == 0) {
						this.currObj = res.data.result.drive_history
					}
				})
			},
			getDayOil(){
				driveDay({
					data:{
						car_id:this.id,
						time:format(new Date().getTime(),'day')
					}
				}).then(res=>{
					if(res.data.code == 0) {
						this.dayObj = res.data.result.drive_history_day
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "./oil-analyze.scss"
</style>
