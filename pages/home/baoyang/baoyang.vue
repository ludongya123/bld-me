<template>
	<view class="baoyang">
		<uni-nav-bar @backPage="backPage" :leftIconType="share==1?'home-l':'back-d'" title="保养预约" backgroundColor="#283540" color="#fff"></uni-nav-bar>
		<!-- 11111111111顶图 -->
		<swiper v-if="banners.length!=0" class="banner-swiper" :indicator-dots="true" :autoplay="autoplay" :interval="4000" :duration="800" circular>
			<swiper-item v-for="(item,index) in banners" :key="index">
				<view class="swiper-item">
					<image :src="item.pic_url" @click="openWeb(item)" mode="aspectFill"></image>
				</view>
			</swiper-item> 
		</swiper>
		<!-- 2222222222222车辆信息 + 里程数 -->
		<view class="car_message_box" v-if="carId!=''">
			<!-- 车辆信息 -->
			<view class="message_top flex-start" @click="changeCar">
				<!-- <image src="../../../static/home/index/index_top_header.png" class="top_img"></image> -->
				<image :src="'https://carbrand.car-me.com/' + checkCarMsg.brand_id + '.png'" class="top_img"></image>
				<view class="top_car_msg">
					<view class="car_msg_name">
						<!-- 浙A 88888 -->
						{{checkCarMsg.car_no || ''}}
					</view>
					<view class="car_msg_des">
						<!-- 奔驰C级 2016 C200L 运动版 -->
						{{checkCarMsg.series_name}} {{checkCarMsg.vehicle_type_name || ''}}
					</view>
				</view>
				<view class="top_change_btn flex-start">
					<text>切换</text>
					<image class="icon" src="/static/user/a-l-l.png" mode=""></image>
				</view>
			</view>
			<view class="xiline"></view>
			<!-- 输入里程数 -->
			<view class="message_bottom">
				<view class="message_bottom_left">
					行驶里程：
				</view>
				<view class="message_bottom_right">
					<input type="number" placeholder="请输入行驶里程数" placeholder-style="color: #CCCCCC;font-size: 28upx;tex-align: right;"
					 v-model="mileage" maxlength="6"> km
				</view>
			</view>

		</view>
		<!-- 添加车辆 -->
		<view class="add-car flex-start" v-if="carId==''" @click="openAddCar()">
			<image class="icon1" :src="showType==1?'/static/home/add.png':'/static/home/user.png'" mode=""></image>
			<view class="middle">
				<view class="title">
					{{showType==1?'添加车辆':'立即登录获取'}}
				</view>
				<view class="desc">
					{{showType==1?'添加车辆获取更多车辆信息':'立即登录获取车辆'}}
				</view>
			</view>
			<image  class="icon2" src="/static/user/a-l-d.png" mode=""></image>
		</view>
		
		<view class="line_gray_16"></view>

		<!-- 33333333 -->
		<view class="shop_change_line">
			<view class="shop_line_top" @click="yuyueStore">
				<view class="shop_change_line_1  flex-start">
					<image src="../../../static/home/baoyang/icon_4s.png" class="icon_4s"></image>
					<text>预约4S店</text>
				</view>
				<view class="shop_change_line_2 flex-between">
					<text>{{checkStoreMsg.name || ''}}</text> 
					<image class="icon" src="/static/user/a-l-l.png" mode=""></image>
				</view>
				
				<view class="shop_change_line_3 flex-start">
					<view class="line_3_address">{{checkStoreMsg.address || ''}}</view>
					<view class="flex-end" v-if="checkStoreMsg.distance">
						<image class="icon" src="/static/home/roadside/icon_location.png" mode=""></image>
						<text class="line_3_distance">{{checkStoreMsg.distance>=1?checkStoreMsg.distance+'km':(checkStoreMsg.distance*1000)+'m'}}</text>
					</view>
				</view>
			</view>
			<view class="xiline"></view>
			<view class="shop_line_bottom flex-start" @click="ChTime">
				<image src="../../../static/home/baoyang/icon_time.png" class="icon_time"></image>
				<view class="time_title">到店保养时间</view>
				<view class="btn_time flex-end">
					<block v-if="time.chooseTimeData">
					 <text>	{{time.chooseTimeData.chooseDateString}} {{time.chooseTimeData.chooseTimeString}}</text>
					</block>
					<block v-else><text>请选择</text></block>

					<image class="icon" src="/static/user/a-l-l.png" mode=""></image>
				</view>
			</view>

		</view>

		<!-- 444444444 底部按钮 -->
		<view class="xiline bottom_bor_top"></view>
		<view class="bottom_btn_groups flex-start">
			<view class="btn_call" @click="toCall" v-if="checkStoreMsg.service_number">
				<image src="../../../static/home/baoyang/icon_call.png" class="icon_call"></image>
				电话预约
			</view>
			<view class="btn_commit_yy no_commit" v-if="!carId || !checkStoreMsg.id || !time.chooseTimeData || !mileage || mileage<=0">提交预约</view>
			<view class="btn_commit_yy" @click="createYy" v-else>提交预约</view>
		</view>

		<!-- 选择车辆弹框 -->
		<BYPickCarView @toAddCar="toAddCar" @checkCar="checkCar" :changeCarFlag="changeCarFlag" :currCarId="carId" :yyCarList="yyCarList"></BYPickCarView>
		<!-- 选择店铺弹框 v-on:closeModal="closeModal" -->
		<YYPickStore @checkStore="checkStore" tag="保养" :storeFlag="yuyueStoreFlage" :storeList="yyStoreList"></YYPickStore>
		<!-- 选择时间弹框 -->
		<ChPickTime v-on:closeDateModal="closeDateModal" :chTimeFlage="time.ChTimeFlage" :timeMsg="time.timeMsg"></ChPickTime>



	</view>
</template>

<script>
	import BYPickCarView from '../../../components/home/baoyang/baoyangPickCar.vue'
	import YYPickStore from '../../../components/home/baoyang/yuyuePickStore.vue'
	import ChPickTime from '../../../components/home/baoyang/choosePickTime.vue'
	import {
		getReserveTime,
		storeList,
		getCarList, 
		createYy,
		reserveStore,
		banner
	} from '../../../api/home/index.js'
	import {goPage} from "../../../util/util.js"
	import {mapMutations,mapGetters} from "vuex"
	import {shopDetail,singleCar,editCar} from "../../../api/user.js"
	export default {
		components: {
			BYPickCarView,
			YYPickStore,
			ChPickTime
		},
		data() {
			return {
				sss_id:'',// 门店id
				carId:'', // 保养车辆的id
				banners:[],
				autoplay:true, // banner是否自动播放
				yyStoreList: [], // me_4S店_全部4S店列表
				checkStoreMsg: {}, // 选中的4s店信息
				yyCarList: [], // 车辆列表
				mileage:'',
				checkCarMsg:  null, // 选中的车的信息
				changeCarFlag: false, // 选择车辆
				yuyueStoreFlage: false, // 预约店铺
				time: {
					timeMsg: null, // timeMsg.tips: 预约到店即可享受工时费9折优惠提示,timeMsg.times时间(时间展示列表)
					ChTimeFlage: false, // 修改时间
					chooseTimeData: null, // 选择的时间
				},
				showType:0 , // 转发页面用户如果没有车辆的情况下 0 表示未登录 1表示无车辆
				share:0
			}
		},
		onLoad(option) {  
			this.sss_id = option.sss_id  
			this.share = option.share || '0'
		},
		computed:{
			...mapGetters(['getIsLocation'])
		},
		watch:{ 
			carId(){
				this.getCarDetail()
			} ,
			getIsLocation(val){
				if(val) {
					this.$hasToken().then(res=>{ 
						this.getYyIndexMsg();
					})
				}
			}
		},
		onShow() {
			this.$hasToken().then(res=>{ 
				this.getYyIndexMsg();  
				this.getBanner(); 
			})
		},
		onShareAppMessage(res) {
			return {
			  title: '保养预约',
			  path: '/pages/home/baoyang/baoyang?sss_id='+this.sss_id+'&share=1'
			}
		 },
		onHide() {
			this.changeCarFlag = false
		},
		methods: {
			...mapMutations(['setIndexStoreId']), 
			backPage(){ 
				if(this.share == 1) {
					this.setIndexStoreId(this.sss_id)
					uni.switchTab({
						url:'/pages/home/home'
					})
				} else {
					uni.navigateBack({
						
					})
				}
			},
			// 获取banner
			getBanner(){
				banner({
					data:{
						ssss_id:this.sss_id,
						page_type:3
					}
				}).then(res=>{
					if(res.data.code == 0) {
						let list = res.data.result.list
						for (let i in list) {
							list[i].link = JSON.parse(list[i].link)
						}
						this.banners = list 
					}
				})
			},
			// 获取车辆信息
			getCarDetail(){
				singleCar({
					data:{
						id:this.carId
					}
				}).then(res=>{
					if(res.data.code == 0 ) {
						this.checkCarMsg = res.data.result.user_car
						this.mileage = res.data.result.user_car.mileage || ''
					}
				})
			},
			// 获取门店信息
			getYyIndexMsg(sssid='') { 
				// uni.showLoading({
				// 	title:'加载中...',
				// 	mask:true
				// })
				if(sssid){
					this.sss_id  = sssid;
				}
				reserveStore({
					data: {
						store_id: this.sss_id ,
						car_id: this.carId
					}
				}).then((res) => {  
					// uni.hideLoading()
					if (res.data.code == 0) { 
						res.data.result.reserve_store.distance = res.data.result.reserve_store.distance > 0 ? (res.data.result.reserve_store.distance / 1000).toFixed(2) : ''
						this.checkStoreMsg = res.data.result.reserve_store
						this.carId = res.data.result.car ? res.data.result.car.id : ''
						this.mileage = res.data.result.car ? res.data.result.car.mileage : ''
						console.log(res.data.result)
						if(this.carId == '') {
							if(uni.getStorageSync('isMobile') == 1) {
								this.showType = 1 
							} else { 
								this.showType = 0
							}
						}
					} else {
						uni.showToast({
							title:res.data.message,
							icon:"none"
						})
					}
				}).catch(()=>{
					uni.hideLoading()
				})
			},
			openAddCar(){
				if(this.showType == 1) {
					uni.navigateTo({
						url:`/pages/user/add-car/add-car?fromPage=by`
					})
				} else {
					uni.navigateTo({
						url:'/pages/login/login'
					})
				}
			},
			// 获取默认车辆信息
			getDetaultCar(){
				defaultCar().then(res=>{
					if(res.data.code == 0) {
						this.checkCarMsg = res.data.result.user_car
					}
				})
			},
			// 点击banner处跳转web
			openWeb(item){
				let params = item.link  
				if(params.flag == '4S'){
					this.setIndexStoreId(params.extra.ssss_id)
					uni.switchTab({
						url:'/pages/home/home'
					}) 
				} else if (params.flag == 'sy') {
					uni.switchTab({
						url:'/pages/home/home'
					}) 
				} else {
					goPage(Object.assign(params, {
						sss_id: this.sss_id
					}), 'home')
				}
			},
			// 打电话
			toCall() {
				uni.makePhoneCall({
					phoneNumber: this.checkStoreMsg.service_number//仅为示例
				});
			},
			
			// 选择要预约车辆
			changeCar() {

				getCarList({
					data: {
						page_no: '1',
						page_size: '100',
						is_obd: '' // 1：obd车辆，2：非obd车辆
					}
				}).then((res) => { 
					if (res.data.code == 0) {
						if (res.data.result.user_cars.length == 0) {
							uni.showToast({
								title: '您暂无车辆~',
								icon: 'none',
								duration: 2000
							})
							return;
						}
						this.changeCarFlag = true;
						this.yyCarList = res.data.result.user_cars;
					}
				})
			},
			// 关闭时间选择器
			closeDateModal(data = null) { 
				this.time.ChTimeFlage = false;
				this.autoplay = true
				if(data) {
					this.time.chooseTimeData = data;
				}
				
			},
			// 获取4s店列表
			yuyueStore() {
				if (this.yyStoreList.length != 0) {
					this.yuyueStoreFlage = true;
					return;
				}
				this.yuyueStoreFlage = true;
				storeList({
					data: {
						page_no: '1',
						page_size: '1000'
					}
				}).then(res => { 
					if (res.data.code == 0) {
						let list = res.data.result.cities
						for(let i in list) {
							for (let j in list[i].stores){
								list[i].stores[j].distance = list[i].stores[j].distance > 0 ? (list[i].stores[j].distance / 1000).toFixed(2) : ''
							}
						}
						this.yyStoreList = list;
					}
				})
			},
		
			// 获取预约时间的信息
			ChTime() {
				let obj = {
					store_id: this.sss_id,
					order_type: ''
				}
				getReserveTime({
					data: obj
				}).then(res => {
					if (res.data.code == 0) { 
						this.time.ChTimeFlage = true 
						this.autoplay = false
						res.data.result.times.forEach((item, index) => {
							item['dateUse'] = item.date.substring(5, 10)
						})
						this.time.timeMsg = res.data.result
					} else {
						this.time.timeMsg = null
					}
				})
			},
			// 选择4s店
			checkStore(storeMsg) { 
				this.yuyueStoreFlage = false;
				if (storeMsg != 'close') { 
					if(!storeMsg.id) {
						uni.showToast({
							title:'缺少门店id',
							icon:'none'
						})
						return
					}
					this.time.chooseTimeData = null 
					this.sss_id = storeMsg.id
					this.time.timeMsg = null  
					storeMsg.service_number = storeMsg.rescue_phone
					this.checkStoreMsg = storeMsg
					this.getYyIndexMsg(storeMsg.id)
					this.getBanner();
				}
			},
			// 选择车辆
			checkCar(carMsg) { 
				this.changeCarFlag = false;
				if (carMsg != 'close') { 
					this.carId = carMsg.id
				}
			}, 
			// 跳转添加车辆
			toAddCar(){
				uni.navigateTo({
					url:`/pages/user/add-car/add-car?fromPage=by`
				})
			},
			// 编辑车辆
			saveCarInfo(){
				editCar({
					data:{
						id:this.carId,
						mileage:this.mileage
					}
				}).then(res=>{
					if(res.data.code == 0) {}
				})
			},
			// 保存预约
			createYy() {
				if(uni.getStorageSync('isMobile') != 1) {
					uni.showModal({
						title:'提醒',
						content:'你还没有登录，请先登录',
						confirmColor:"#B49A83",
						success(res) {
							if(res.confirm) {
								uni.navigateTo({
									url:'/pages/login/login'
								})
							}
						}
					})
					
					return
				}
				let car_id = this.carId;
				let reserve_store_id = this.checkStoreMsg.id;
				let reserve_time = this.time.chooseTimeData.chooseDateString + ' ' + this.time.chooseTimeData.chooseTimeString
				uni.showLoading({ 
					title:'正在提交...',
					mask:true
				})
				this.saveCarInfo()
				createYy({
					data: {
						reserve_type: '2', // 1:维修，2：保养
						car_id: car_id,
						reserve_store_id: reserve_store_id, // 预约门店id
						reserve_time: reserve_time, // 预约时间
						images: '' // 维修上传图片
					}
				}).then(res => {
					uni.hideLoading()
					this.time.chooseTimeData = null  
					this.time.timeMsg = null  
					if(res.data.code == 0) {
						uni.navigateTo({
							url: '../../user/appointment-state/appointment-state?id=' + res.data.result.reserve_id
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import './baoyang.scss'
</style>
