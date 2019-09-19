<template>
	<view>
		<view class="top">
			<view class="car-info flex-start">
				<image :src="carIcon+carInfo.brand_id+'.png'" mode=""></image>
				<view class="car-info-r">
					<view class="title-name">{{carInfo.car_no}}</view>
					<view class="title-desc">{{carInfo.brand_name}} {{carInfo.series_name}} {{carInfo.vehicle_type_name}}</view>
				</view>
			</view>
			<view class="flex-around menu">
				<view class="menu-list" @click="openPage('car-livedata')">
					<image class="icon" src="/static/user/data.png" mode=""></image>
					<view class="menu-list-tip">实时数据</view>
				</view>
				<view class="menu-list" @click="openPage('oil-analyze')">
					<image  class="icon" src="/static/user/soil.png" mode=""></image>
					<view class="menu-list-tip">油耗分析</view>
				</view>
				<view class="menu-list" @click="openPage('drive-analyze')">
					<image  class="icon" src="/static/user/draver.png" mode=""></image>
					<view class="menu-list-tip">驾驶行为</view>
				</view>
			</view>
		</view>
		
		<view class="notice-list">
			<view class="notice-title flex-between">
				<view class="flex-start">
					<image src="/static/user/notice.png" mode=""></image>
					<text>异常提醒</text>
				</view>
				<view class="flex-end" @click="openPage('set-notice')">
					<text>设置</text>
					<image src="/static/user/a-l-d.png" mode=""></image> 
				</view>
			</view>
			<!-- 异常列表 -->
			<view class="list-g" v-show="closeCount<7">
				<block v-for="(item,index) in noticeInfo" :key="index">
					<view class="list-i flex-start">
						<image src="/static/user/notice-l.png" mode=""></image>
						<text class="notice-desc">{{item.text}}</text>
						<text class="notice-time">{{item.action_date}}</text>
					</view>
				</block>
			</view>
			<view class="xiline" v-show="allNoticeInfoLen>3 && closeCount!=7"></view>
			<view class="flex-center" v-show="allNoticeInfoLen>3 && closeCount!=7" @click="openPage('notice-list')">
				<text>查看更多</text>
				<image src="/static/user/a-down.png" mode=""></image>
			</view>
			
			<!-- 未开通提醒 -->
			<view class="flex-start not-open" v-if="closeCount==7">
				<view class="f-l">
					<view class="tip">开启车辆异常提醒，我们将会第一时间通知您</view>
					<view class="btn"  @click="openPage('set-notice')">
						立即开启
						<image src="/static/user/a-l-y.png" mode=""></image>
					</view>
				</view>
				<image class="wkt" src="/static/user/wkt.png" mode=""></image>
			</view>
			
			<!-- 没有异常 -->
			<view class="no-notice" v-if="noticeInfo.length==0 && closeCount<7">当前爱车无异常，请继续保持哦~</view>
		</view>
		
		<view class="car-location">
			<view class="local-title flex-start">
				<image src="/static/user/local1.png" mode=""></image>
				<text>定位车辆</text>
			</view>
			<view class="addr-d">{{address}}</view>
			<map class="map" v-show="markers[0].latitude!='' && markers[0].longitude!=''" :latitude="markers[0].latitude" :longitude="markers[0].longitude"  
		 :markers="markers"  scale="15" show-location @tap="openMap"></map>
			<view class="no-location" v-show="markers[0].latitude=='' || markers[0].longitude==''">暂时没有定位信息~</view>
		</view>
	</view>
</template>

<script>
	import {singleCar,noticeList,noticeSetting,carIcon} from "../../../api/user.js"
	import {
		getLocationName
	} from '../../../util/util.js'
	import {
		obdLocation
	} from "../../../api/user.js"
	import {bd09togcj02}  from "../../../util/util.js"
	export default {
		data(){
			return { 
				address:'',
				markers: [{
					iconPath: "../../../static/location.png",
					id: 1,
					latitude: '',
					longitude: '',
					width: 30, 
					height: 30 
				}],
				carIcon:carIcon,
				closeCount:0, // 关闭的提醒项数量
				id:'', // 车辆 id
				carInfo:{},
				
				allNoticeInfoLen:0, // 获取的提醒信息的条数
				noticeInfo:[] // 获取的提醒信息的前三条
			}
		},
		onLoad(opts) {
			uni.hideShareMenu() 
			
			this.id = opts.carId || ''
			this.getSingleCar()
		},
		onShow(){
			this.getCloseObd()
			this.getobdLocation()
			this.getNoticeList()
		},
		methods:{
			// 单个车的信息
			getSingleCar(){
				singleCar({
					data:{
						id:this.id
					}
				}).then(res=>{
					if(res.data.code == 0) {
						this.carInfo = res.data.result.user_car
					}
				})
			},
			getCloseObd(){ 
				noticeSetting({
					data:{
						car_id:this.id
					}
				}).then(res=>{ 
					if(res.data.code == 0) { 
						this.closeCount = res.data.result.close_count 
					}
				})
			},
			// 异常信息列表
			getNoticeList(){
				noticeList({
					data:{
						page_no:1,
						page_size:10,
						car_id:this.id
					}
				}).then(res=>{
					if(res.data.code == 0) {
						this.allNoticeInfoLen = res.data.result.list.length
						let noticeInfo = res.data.result.list,
						len = noticeInfo.length
						if(len<=3){
							this.noticeInfo = noticeInfo
						} else {
							this.noticeInfo = noticeInfo.slice(0,3)
						}
					}
				})
			},
			// 获取车辆定位
			getobdLocation() {
				obdLocation({
					data: {
						car_id: this.id,
						coordinate_type: "gcj02"
					}
				}).then(res => {
					if (res.data.code == 0) { 
						let {
							last_track_lon,
							last_track_lat  
						} = res.data.result.device_gps 
						if(last_track_lat && last_track_lat){
							let coords = bd09togcj02(last_track_lon,last_track_lat)
							this.markers[0].latitude = coords[1]
							this.markers[0].longitude = coords[0]
							let obj = {latitude: coords[1], longitude:coords[0]};
							getLocationName(obj).then(addr=>{
								if(addr.status === 0){
									this.address= addr.result.address
								}
							}) 
						}
						
						
					}
				})
			} ,
			openPage(p){
				uni.navigateTo({
					url:`/pages/user/${p}/${p}?carId=${this.id}`
				}) 
			},
			// 点击地图
			openMap(){
				if(this.markers[0].latitude == '' || this.markers[0].longitude == '') return
				uni.navigateTo({
					url:`/pages/user/car-location/car-location?id=${this.id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "./car-butler.scss"
</style>
