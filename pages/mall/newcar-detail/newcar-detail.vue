<template>
	<view class="wrapper">
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
			
			<swiper-item v-for="(item,index) in carInfo.car_image" :key="index"> 
				<view class="swiper-item">
					<image :src="item" mode="aspectFill"></image>
				</view>
			</swiper-item>
		</swiper>
		<!-- 车型信息 -->
		<view class="car-info">
			<view class="car-name">{{carInfo.car_name}}</view>
			<view class="car-price">
				<text class="dis-price">{{carInfo.store_price_range}}</text>
				<text class="origin-price">厂商指导价：{{carInfo.price_range}}</text>
			</view>
			<view class="intro">{{carInfo.represent}}</view>
			<view class="tags flex-start">
				<text v-for="(item,index) in carInfo.tags" :key="index">{{item}}</text> 
			</view>
		</view>
		
		<!-- 车系的价格 -->
		<view class="car-series">
			<block v-for="(item,index) in onSellInfo">
				<view class="car-series-item flex-start" :key="index"> 
					<view class="info" @click="openCarConfig(item.car_item_id)">
						<view class="title">{{item.car_name}}</view>
						<view class="sub-title flex-start">
							<text class="dis-price">{{item.price}}</text>
							<text class="ori-price">厂商指导价：{{item.store_price}}</text>
							<image src="/static/mall/a-d.png" mode="" v-if="item.depreciate && item.depreciate!=0"></image>
							<text class="discount" v-if="item.depreciate && item.depreciate!=0">{{item.depreciate}}</text>
						</view>
					</view>
					<text class="btn" @click="showLayer(1,item.car_item_id)">询底价</text>
				</view>
				<view class="xiline" :key="index"></view>
			</block>
		</view>
		
		<!-- 门店信息 -->
		<view class="store-info flex-start">
			<view class="store-icon">
				<image class="img" :src="storeInfo.store_image" mode="aspectFill"></image>
				<!-- <view class="brand-icon flex-start">
					<image :src="carIcon+'1.png'" mode=""></image>
				</view> -->
			</view>
			<view class="title-address">
				<view class="store-title">{{storeInfo.store_name}}</view>
				<view class="address">
					<text v-if="storeInfo.store_distance != ''">{{storeInfo.store_distance>=1?storeInfo.store_distance+'km':(storeInfo.store_distance*1000+'m')}}</text>
					
					<text>{{storeInfo.store_address}}</text>
				</view>
			</view>
			<view class="nav-icon" @click="openLocation()">
				<image src="/static/mall/location.png" mode=""></image>
				<text>导航</text>
			</view>
		</view>
		<!-- 车型配置 -->
		<view class="car-config" v-if="richText">
			<view class="title">
				详情说明
			</view>
			<view class="config-detail">
				<rich-text :nodes="richText"></rich-text>
			</view>
			 
		</view>
		
		<view class="handle-area flex-start">
			
			<view class="left" @click="showLayer(2)"> 提交预约 </view>
			<view class="right" @click="showLayer(1)"> 
				询底价
			</view>
		</view>
		<!-- 弹层 -->
		<view class="layer" v-show="layerType!=-1"> </view>
		<!--  弹层 -->
		<view class="layer-content" :class="{content2:layerType==2,show:layerType!=-1}">
			<image class="icon" src="/static/home/index/icon_delete.png" mode="" @click="closeLayer"></image>
			 <view class="title" >{{layerType==1?'询底价':'预约试驾'}}</view>
			 <view class="desc">4S店服务顾问第一时间为您服务</view>
			 <input type="number" maxlength="11" class="input-tel" v-model="tel" placeholder="请输入手机号" placeholder-style="color:#ccc;font-size:28upx;"/>
			 <view class="xiline"></view>
			 <view class="flex-center" v-show="layerType==2" @click="showChooseTime">
			 	<text :class="{active:yyTime!=''}">{{yyTime || '选择到店时间'}}</text>
				<image src="/static/user/a-l-d.png" mode=""></image>
			 </view>
			 <view class="xiline" v-show="layerType==2"></view>
			 
			 <view class="btn" v-if="layerType==1" @click="submitZiXun()" :class="(/^1[3456789]\d{9}$/.test(tel)) ?'active' :''">询底价</view>

			 <view class="btn" v-if="layerType==2" @click="subTestDrav()" :class="((/^1[3456789]\d{9}$/.test(tel)) && yyTime!='') ?'active' :''">预约试驾</view>
		</view>
		<!-- 选择时间弹框 -->
		<ChPickTime v-on:closeDateModal="closeDateModal" :chTimeFlage="isShowChooseTime" :timeMsg="time.timeMsg"></ChPickTime>
	</view>
</template>

<script>
	import ChPickTime from '../../../components/home/baoyang/choosePickTime.vue'
	import { carIcon ,user} from "../../../api/user.js" 
	import { newCarDetail ,ziXun,reserveTime,testDriver,carConfig} from "../../../api/mall.js"
	import {bd09togcj02} from "../../../util/util.js"
	export default {
		data() {
			return { 
				ssssId:'',
				carId:'',// 整个页面的车系id
				ziXunCarId:'',//咨询某一车型的车的id
				layerType:-1, // 1询底价 2提交预约试驾
				carIcon:carIcon,
				tel:'',
				yyTime:'',
				isShowChooseTime:false,
				time:{
					timeMsg:null
				},
				carInfo:{}, // 车辆信息
				onSellInfo:[{id:1}], // 在售车型
				storeInfo:{} ,// 门店信息
				configInfo:[] ,// 车辆配置信息
				richText:'' // 车的详情说明 富文本
			}
		},
		components:{
			ChPickTime
		},
		onLoad(opts) {
			this.carId = opts.carId || ''
			this.ssssId = opts.ssssId || ''
			this.getNewCarDetail()
			this.getUserInfo()
		},
		methods: {
			// 显示弹层 询底价、预约时间  
			showLayer(n,cid=''){
				if(n == 1){
					this.ziXunCarId = cid 
				} 
				this.layerType = n
			},
			// 关闭弹层
			closeLayer(){
				this.layerType = -1; 
			},
			// 获取用户手机号
			getUserInfo(){
				user().then(res=>{
					if(res.data.code == 0) {
						this.tel = res.data.result.user_info.mobile || ''
					}
				})
			},
			// 车辆详情
			getNewCarDetail(){ 
				uni.showLoading({
					title:'加载中...'
				})
				newCarDetail({
					data:{
						car_id:this.carId,
						store_id:this.ssssId
					}
				}).then(res=>{
					uni.hideLoading()
					if(res.data.code == 0) {
						let {car_info,on_sell_info,rich_text,store_info} = res.data.result
						car_info.car_image = car_info.car_image.split(',')
						car_info.tags = car_info.tags == '' ? [] : car_info.tags.split(',') 
						store_info.store_distance = store_info.store_distance > 0 ? (store_info.store_distance/1000).toFixed(2) : ''
						this.carInfo = car_info
						this.richText = rich_text
						this.onSellInfo = on_sell_info
						this.storeInfo = store_info
						this.getCarConfig()
					}
				}).catch(()=>{
					uni.hideLoading()
				})
			},
			// 打开车辆配置
			openCarConfig(id){
				uni.navigateTo({
					url:`/pages/mall/car-config/car-config?id=${id}`
				})
			},
			// 获取车辆配置
			getCarConfig(){
				uni.showLoading({
					title:'加载中...',
					mask:true
				})
				carConfig({
					data:{
						id:this.carId
					} 
				}).then(res=>{
					uni.hideLoading()
					if(res.data.code == 0) {
						this.configInfo = res.data.result.infos[0].items.length > 5 ? res.data.result.infos[0].items.substring(0,5) : res.data.result.infos[0].items
						console.log(this.configInfo)
					}
				}).catch(()=>{
					uni.hideLoading()
				})
			},
			// 打开地图
			openLocation(){ 
				let coords = bd09togcj02(this.storeInfo.location.split(',')[0],this.storeInfo.location.split(',')[1]);
				console.log(coords)
				uni.openLocation({
					longitude:coords[0],
					latitude:coords[1],
					name:this.storeInfo.store_name,
					address:this.storeInfo.store_address
				})
			},
			// 获取可预约时间范围
			getWalkCarTime() {
				uni.showLoading({
					title:'加载中',
					mask:true
				})
				reserveTime({
					data: {
						reserve_store_id: this.ssssId,
						car_id:this.carId
					}
				}).then((res) => {  
					uni.hideLoading()
					if (res.data.code == 0) {
						this.isShowChooseTime = true
						res.data.result.dates.forEach((item, index) => {
							item['dateUse'] = item.short_date
						})
						res.data.result.times = res.data.result.dates
						delete res.data.result.dates 
						this.time.timeMsg = res.data.result
					} else {
						this.time.timeMsg = null
					}
				})
			},
			// 显示时间选择的弹窗
			showChooseTime(){
				this.getWalkCarTime() 
			},
			// 确认选择时间
			closeDateModal(data=null){
				this.isShowChooseTime = false
				if(data) {
					this.yyTime = data.chooseDateUse+" "+data.chooseDateDesc+" "+data.chooseTimeString
				}
			},
			// 提交咨询
			submitZiXun(){
				if(!(/^1[3456789]\d{9}$/.test(this.tel))) {
					uni.showToast({
						title:'手机号格式错误',
						icon:'none'
					})
					return
				}  
				uni.showLoading({
					title:'提交中...',
					mask:true
				})
				let data1 = {
					store_id:this.ssssId,
					mobile:this.tel,
					car_id:this.carId,
				},
				data2 = {
					store_id:this.ssssId,
					mobile:this.tel,
					car_item_id: this.ziXunCarId
				}
				ziXun({
					data: this.ziXunCarId == ''? data1:data2
				}).then(res=>{
					uni.hideLoading()
					if(res.data.code == 0) {
						// 提交咨询成功 
						uni.showToast({
							title:res.data.result.notice,
							icon:'none',
							mask:true
						}) 
						this.layerType = -1
					} 
				}).catch(()=>{
					uni.hideLoading()
				})
			},
			// 提交试驾
			subTestDrav(){
				if(!(/^1[3456789]\d{9}$/.test(this.tel))) {
					uni.showToast({
						title:'手机号格式错误',
						icon:'none'
					})
					return
				}
				if(this.yyTime == '') {
					uni.showToast({
						title:'请选择预约时间',
						icon:'none'
					})
					return
				}
				uni.showLoading({
					title:'提交中...',
					mask:true
				})
				testDriver({
					data:{
						store_id:this.ssssId,
						car_id:this.carId,
						mobile:this.tel,
						appointment_time:this.yyTime
					}
				}).then(res=>{
					uni.hideLoading()
					if(res.data.code == 0) { 
						uni.showToast({
							title:res.data.result.notice,
							mask:true,
							icon:'none'
						})
						this.layerType = -1
					}
				}).catch(()=>{
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
@import './newcar-detail.scss'
</style>
