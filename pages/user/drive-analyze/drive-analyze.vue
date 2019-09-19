<template>
	<view class="wrapper">
		<view class="nav flex-start">
			<view class="nav-item" @click="switchNav(0)" :class="index==0?'active':''">
				<text>日报表</text>
			</view>
			<view class="nav-item" @click="switchNav(1)" :class="index==1?'active':''">
				<text>月报表</text>
			</view>
		</view>
		<view class="options">
			<view class="date-choose"> 
				<picker mode="date" :start="startVal" :end="maxTime" :fields="index==0?'day':'month'" @change="changePicker" :value="date">
					<view>
						{{index==0?dateD:dateM}}
						<image src="/static/user/calendar.png" mode=""></image>
					</view>
				</picker>
			</view>
			<view class="list-g">
				<view class="list-i flex-start">
					<text class="tip">行驶里程</text>
					<text class="val">{{info.distance}}</text>
					<text class="unit">公里</text>
				</view>
				<view class="xiline"></view>
				<view class="list-i flex-start">
					<text class="tip">最高车速</text>
					<text class="val">{{info.max_speed}}</text>
					<text class="unit">km/h</text>
				</view>
				<view class="xiline"></view>
				<view class="list-i flex-start">
					<text class="tip">超速次数</text>
					<text class="val">{{info.over_speed_count}}</text>
					<text class="unit">次</text>
				</view>
				<view class="xiline"></view>
				<view class="list-i flex-start">
					<text class="tip">急加速次数</text>
					<text class="val">{{info.fas_count}}</text>
					<text class="unit">次</text>
				</view>
				<view class="xiline"></view>
				<view class="list-i flex-start">
					<text class="tip">急刹车次数</text>
					<text class="val">{{info.slo_count}}</text>
					<text class="unit">次</text>
				</view>
				<view class="xiline"></view>
				<view class="list-i flex-start">
					<text class="tip">平均车速</text>
					<text class="val">{{info.average_speed}}</text>
					<text class="unit">km/h</text>
				</view>
				<view class="xiline"></view>
				<view class="list-i flex-start">
					<text class="tip">总耗时</text>
					<text class="val">{{info.take_time}}</text>
					<text class="unit">小时</text>
				</view>
				<view class="xiline"></view>
				<view class="list-i flex-start">
					<text class="tip">当天行驶评分</text>
					<text class="val">{{info.total_point}}</text>
					<text class="unit">分</text>
				</view>
				<view class="xiline"  v-show="index==0"></view>
				<view class="list-i flex-start" v-show="index==0">
					<text class="tip">单日总油耗</text>
					<text class="val">{{info.total_oil}}</text>
					<text class="unit">L</text>
				</view>
				
			</view>
		</view>

	</view>
</template>

<script>
	import {format} from "../../../util/util.js"
	import {driveDay,driveMonth,obdInstall} from "../../../api/user.js"
	export default {
		data() {
			return {
				id:'',//车id
				index: 0, // 0 日数据  1 月数据
				monthClickCount:0,
				startVal:'2019-03-06',
				maxTime:format(new Date().getTime(),'day'),
				dateD:'', // 日期数据
				dateM:'', // 月份数据
				info:{} ,//数据
				
			}
		},
		onLoad(options) {
			uni.hideShareMenu() 
			
			this.id = options.carId
			this.dateD = format(new Date().getTime(),'day')
			this.dateM = format(new Date().getTime(),'month')
			this.getObjInstallTime() 
		},
		methods: {
			// 获取obd安装时间
			getObjInstallTime(){
				obdInstall({
					data:{
						car_id:this.id
					}
				}).then(res=>{
					if(res.data.code == 0) {
						this.startVal = res.data.result.created_date
						this.getDayData()
					}
				})
			},
			// 获取日数据
			getDayData(){
				driveDay({
					data:{
						car_id:this.id,
						time:this.dateD
					}
				}).then(res=>{
					if(res.data.code == 0) {
						this.info = res.data.result.drive_history_day
					}
				})
			},
			getMonthData(){
				driveMonth({
					data:{
						car_id:this.id,
						time:this.dateM
					}
				}).then(res=>{
					if(res.data.code == 0) {
						this.info = res.data.result.drive_history_month
					}
				})
			},
			switchNav(i) {
				if (this.index == i) return
				this.index = i
				if(i == 0) {
					this.getDayData()
				}
				if(i == 1){
					this.getMonthData()
				}
			},
			changePicker(v) {
				
				if(this.index == 0){
					// 日报表
					this.dateD = v.detail.value
					this.getDayData()
				}
				if(this.index == 1){
					// 月报表
					this.dateM = v.detail.value
					this.getMonthData()
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "./drive-analyze.scss"
</style>
