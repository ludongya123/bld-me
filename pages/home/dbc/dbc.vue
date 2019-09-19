<template>
	<view class="dbc_box">
		<uni-nav-bar @backPage="backPage" :leftIconType="share==1?'home-l':'back-d'" title="代步车" backgroundColor="#283540" color="#fff"></uni-nav-bar>
		<image src="/static/home/topImg.png" mode="aspectFill"  class="dbc_top"></image>

		<view class="shop_change_line">
			<view class="shop_line_top" @click="yuyueStore">
				<view class="shop_change_line_1">
					<image src="../../../static/home/baoyang/icon_4s.png" class="icon_4s"></image>
					维修门店
				</view>
				<view class="flex-start store-info"> 
					<view class="flex-left"> 
						<view class="shop_change_line_2">
							{{shopInfo.detail.name || ''}} 
						</view>
						<view class="shop_change_line_3 flex-start">
							<view class="line_3_address">{{shopInfo.detail.address || ''}}</view>
							<image class="icon_location" v-if="shopInfo.detail.distance" src="/static/home/roadside/icon_location.png" mode=""></image>
							<view class="line_3_distance" v-if="shopInfo.detail.distance">{{shopInfo.detail.distance>=1?shopInfo.detail.distance+'km':(shopInfo.detail.distance*1000)+'m'}}</view>
						</view>
					</view>
					<image class="arrow-icon" src="/static/user/a-l-l.png"></image>
				</view>
			</view>
			<view class="xiline"></view>

			<view class="shop_line_bottom flex-start">
				<image src="../../../static/home/baoyang/icon_time.png" class="icon_time"></image>
				<view class="pick_box  flex-start" @click="showTime">
					<view class="time_title">
						预约用车时间： 
					</view>
					<view class="time_date">
						<block v-if="time.chooseTimeData">
							{{time.chooseTimeData.chooseDateString}} {{time.chooseTimeData.chooseTimeString}}
						</block>
						<block v-else>请选择</block>
						
					</view>
					<image class="a-icon" src="/static/user/a-l-l.png" mode=""></image>
				</view>
			</view>


		</view>

		<!-- 选择店铺弹框 v-on:closeModal="closeModal" -->
		<YYPickStore @checkStore="checkStore" tag="代步车" :storeFlag="storeFlag" :storeList="shopInfo.storeList"></YYPickStore>
		<!-- 选择时间弹框 -->
		<ChPickTime v-on:closeDateModal="closeDateModal" :chTimeFlage="time.ChTimeFlage" :timeMsg="time.timeMsg"></ChPickTime>

		<view class="bottom_submit no_submit" v-if="!time.chooseTimeData || !shopInfo.detail">提交</view>
		<view class="bottom_submit" @click="createWalkCar" v-else>提交</view>


	</view>

</template>

<script>
	import YYPickStore from '../../../components/home/baoyang/yuyuePickStore.vue'
	import ChPickTime from '../../../components/home/baoyang/choosePickTime.vue'
	import {
		storeList,
		getWalkCarTime,
		createWalkCar
	} from '../../../api/home/index.js'
	import {
		shopDetail
	} from "../../../api/user.js"
	import {mapGetters,mapMutations} from 'vuex'
	export default {
		components: {
			YYPickStore,
			ChPickTime
		},
		data() {
			return {
				sss_id: '', // 4s店id
				storeFlag: false, // 预约店铺flag
				shopInfo: {
					storeList: [], // me_4S店_全部4S店列表
					detail: null // 选中的4s店信息
				},
				time: {
					ChTimeFlage: false, // 时间弹框
					timeMsg: null, // timeMsg.tips: 预约到店即可享受工时费9折优惠提示,timeMsg.times时间(时间展示列表)
					chooseTimeData: null, // 选择的时间
				}

			}
		},
		
		onLoad(option) {
			this.sss_id = option.sss_id 
			this.share = option.share || '0'
		},
		onShareAppMessage(res) {
			return {
			  title: '代步车',
			  path: '/pages/home/dbc/dbc?sss_id='+this.sss_id +'&share=1'
			}
		},
		onShow() {
			this.$hasToken().then(res=>{
				this.getStoreDetail();
			})
		},
		computed:{
			...mapGetters(['getIsLocation'])
		},
		watch:{
			getIsLocation(v){
				if(v) {
					this.$hasToken().then(res=>{
						this.getStoreDetail();
					})
				}
			}
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
			// 获取代步车可预约时间范围
			getWalkCarTime() {
				uni.showLoading({
					title:'加载中',
					mask:true
				})
				getWalkCarTime({
					data: {
						store_id: this.sss_id
					}
				}).then((res) => {  
					uni.hideLoading()
					if (res.data.code == 0) {
						this.time.ChTimeFlage = true
						res.data.result.times.forEach((item, index) => {
							item['dateUse'] = item.date.substring(5, 10)
						})
						this.time.timeMsg = res.data.result
					} else {
						this.time.timeMsg = null
					}
				})
			},
			// 获取预约车辆/门店信息
			getStoreDetail() {
				uni.showLoading({
					title:'加载中',
					mask:true
				})
				shopDetail({
					data: {
						id: this.sss_id
					}
				}).then((res) => {
					uni.hideLoading()
					if (res.data.code == 0) {
						res.data.result.distance = res.data.result.distance > 0 ? (res.data.result.distance / 1000).toFixed(2) : ''
						this.shopInfo.detail = res.data.result;
					}
				})
			},
			// 获取可预约时间
			showTime(){  
				this.getWalkCarTime() 
			},
			// 选择预约店铺
			yuyueStore() {
				if (this.shopInfo.storeList.length != 0) {
					this.storeFlag = true;
					return;
				}
				uni.showLoading({
					title:'加载中',
					mask:true
				})
				this.storeFlag = true;
				storeList({
					data: {
						page_no: '1',
						page_size: '1000'
					}
				}).then(res => { 
					uni.hideLoading()
					if (res.data.code == 0) {
						let list = res.data.result.cities
						for(let i in list) {
							for (let j in list[i].stores){
								list[i].stores[j].distance = list[i].stores[j].distance > 0 ? (list[i].stores[j].distance / 1000).toFixed(2) : ''
							}
						} 
						this.shopInfo.storeList = list;
					}
				})
			},
			// 选择店铺
			checkStore(storeMsg) { 
				this.storeFlag = false;
				if (storeMsg != 'close') {
					if(!storeMsg.id) {
						uni.showToast({
							title:'缺少门店id参数',
							icon:'none'
						})
						return
					}
					this.time.chooseTimeData = null 
					this.sss_id = storeMsg.id
					this.getStoreDetail()
					this.time.timeMsg = null
				}
			},
			// 关闭选时间弹框
			closeDateModal(data = null) { 
				this.time.ChTimeFlage = false;
				if(data) {
					this.time.chooseTimeData = data;
				}
				
			},
			// 提交预约代步车
			createWalkCar() {
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
				uni.showLoading({
					title:'提交中...',
					mask:true
				})  
				let store_id = this.shopInfo.detail.id;
				let time = this.time.chooseTimeData.chooseDateString + ' ' + this.time.chooseTimeData.chooseTimeString;

				createWalkCar({
					data: {
						store_id: store_id,
						time: time
					}
				}).then(res => {
					uni.hideLoading()
					if (res.data.code == 0) {
						uni.redirectTo({
							url: '../../user/success-state/success-state?title=' + '代步车'
						});
					}  
				}) 
			}

		}
	}
</script>

<style lang="scss">
	@import './dbc.scss'
</style>
