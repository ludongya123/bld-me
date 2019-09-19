<template>
	<view>
		<map id="myMap" :longitude="markers[0].longitude" :latitude="markers[0].latitude" scale="14" :markers="markers"
		 @regionchange="mapChange" @end="mapChangeEnd" show-location style="width: 100%;">
		<cover-image src="../../../static/home/roadside/move_location.png" class="icon_move_location" @click="moveToLocation"></cover-image>
			 <cover-view class="location_wrap" v-show="isLocation">
				  
				 <cover-image src="../../../static/home/roadside/mark_box.png" class="icon_mark_box"></cover-image>
				<cover-view class="location_wrap_text">{{locationName}}</cover-view>
			 </cover-view>
		</map>
		<!-- 地图上的中心点地址 -->
		
		<!-- 地图上重置位置 -->
		

		<view class="cover-view-box">

			<view class="map_des">

				<!-- 救援地址 -->
				<view class="map_des_address">
					<view class="map_des_address_title">
						<view class="des1">请确认救援地址</view>
						<view class="des2">（可拖动地图定位）</view>
					</view>
					<input type="text" class="map_des_address_describe" v-model="locationName">
				</view>
				<view class="xiline"></view>

				<!-- 选择门店 -->
				<view class="map_des_store" @click="yuyueStore">
					<view class="shop_change_line_1 flex-start">
						<image src="../../../static/home/roadside/icon_res_store.png" class="icon_4s"></image>
						<view>救援门店<text>（7*24小时）</text></view>
					</view>
					<view class="shop_change_line_2 flex-between">
						<view class="store-left">
							<view class="store-name">{{checkStoreMsg.name}}</view>
							<view class="line_3_address flex-start">
								<view class="address">{{checkStoreMsg.address}}</view>
								<view class="flex-end" v-if="checkStoreMsg.distance">
									<image src="/static/home/roadside/icon_location.png" mode=""></image>
									<text>{{checkStoreMsg.distance>=1?checkStoreMsg.distance+'km':(checkStoreMsg.distance*1000)+'m'}}</text>
								</view>
							</view>
						</view>
						
						<image src="/static/user/a-l-l.png" class="icon_right" mode=""></image>
					</view>
				</view>


			</view>

			<!-- 发起救援人信息 -->
			<view class="person_info">
				<view class="info_item">
					<view class="info_item_left">联系手机号</view>
					<input type="number" placeholder="请输入手机号" placeholder-style="color:#999" maxlength="11" v-model="tel">
				</view>
				<view class="xiline"></view>
				<view class="info_item">
					<view class="info_item_left">是否需要拖车</view>
					<picker @change="trailerPickerChange" :value="railerIndex" :range="arrayTrailer" class="info_item_right">
						{{arrayTrailer[railerIndex] || '不需要'}}
					</picker>
					<image src="/static/user/a-l-l.png" class="icon_right_arrow"></image>
				</view>
				<view class="xiline"></view>
				<view class="info_item">
					<view class="info_item_left">保险公司</view>
					<picker @change="CompChange" :value="compIndex" :range="arrayBXComponeny" class="info_item_right">
						{{arrayBXComponeny[compIndex] || '请选择'}}
					</picker>
					<image src="/static/user/a-l-l.png" class="icon_right_arrow"></image>
				</view>
			</view>

			<!-- 按钮 -->
			<view class="btn_pay" @click="toCall">发送定位并呼叫救援</view>

		</view>

		<!-- 选择店铺弹框 v-on:closeModal="closeModal" -->
		<YYPickStore @checkStore="checkStore" tag="救援" :storeFlag="storeFlag" :storeList="storeList"></YYPickStore>


	</view>
</template>

<script>
	import YYPickStore from '../../../components/home/baoyang/yuyuePickStore.vue'
	import { 
		storeList,
		callRescue
	} from '../../../api/home/index.js'
	import {
		getLocationName
	} from '../../../util/util.js'
	import {
		shopDetail,
		user
	} from "../../../api/user.js"
	import {mapMutations,mapGetters} from "vuex"
	import {bd09togcj02,gcj02tobd09}  from "../../../util/util.js"
	export default {
		components: {
			YYPickStore
		},
		data() {
			return {
				sss_id: '', // 4s店id
				storeFlag: false, // 是否弹出选择门店
				storeList: [], // 预约门店列表
				checkStoreMsg: null, // 选中的4s店信息
				locationName: '',
				markers: [{
					id: 0,
					latitude: '',
					longitude: ''
				}],
				tel:'',
				arrayTrailer: ['不需要', '需要'],
				railerIndex: 0,
				// 1：人保、2：平安、3：太平洋、4：人寿、5：大地、6：中华联合、7：阳光、8：其他
				arrayBXComponeny: ['人保', '平安', '太平洋', '人寿', '大地', '中华联合', '阳光', '其他'],
				compIndex: 0,
				openSettingNum:1,
				isLocation:false
			}
		},
		computed: {
		 	...mapGetters(['getIsLocation'])
		},
		watch:{
			getIsLocation(v){
				if(v){
					this.getYyIndexMsg(); 
					this.getUserInfo();
					this.getLocationInfo()
				}
			}
		},
		onReady: function(e) {
			this.mapCtx = wx.createMapContext('myMap')
		},
		onLoad(option) {
			if(option.scene){
				//小程序二维码
				const scene = decodeURIComponent(option.scene);
				const sssId = option.scene.split("-")[0];
				this.sss_id = sssId 
			}else if(option.sss_id){
				//小程序分享进入或正常进入
				this.sss_id = option.sss_id 
			}
			this.$hasToken().then(() => {
				this.getYyIndexMsg(); 
				this.getUserInfo();
			})
			
		},
		onShareAppMessage(res) {
			return {
			  path: 'pages/home/roadside/roadside?sss_id='+this.sss_id
			}
		},
		onShow() {
			let that = this
			uni.getSetting({
				success(res) { 
					if (res.authSetting['scope.userLocation'] === undefined) {
						// 未授权过位置信息 
						that.markers[0].latitude = '30.271047'
						that.markers[0].longitude = '120.163346'
						if(getCurrentPages().length >1){
							that.getLocationInfo()
						}
					}
					// 拒绝授权120.169813,30.276905
					if (res.authSetting['scope.userLocation'] === false) { 
						that.markers[0].latitude = '30.271047'
						that.markers[0].longitude = '120.163346'
						if(that.openSettingNum>1) {return}
						if(getCurrentPages().length >1){
							uni.showModal({
								title: '提醒',
								content: '为了更好的享受我们的服务，请授权你的地理位置',
								success(r) {
									if (r.confirm) {
										uni.openSetting({
											success(res) {
												that.openSettingNum++
											}
										})
									}
								}
							})
						}
					}
					if (res.authSetting['scope.userLocation'] === true) {
						console.log('一授权')
						that.getLocationInfo()
					}
				}
			})
			
		},
		methods: {
			...mapMutations(['authLocation']),
			getLocationInfo(){
				let that = this
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						uni.getLocation({
							type: 'gcj02',
							success: function(res) { 
								let coords = gcj02tobd09(res.longitude,res.latitude) 
								getApp().globalData.longitude = coords[0]; //当前位置的经度
								getApp().globalData.latitude = coords[1]; //当前位置的纬度  
								that.markers[0].latitude = res.latitude
								that.markers[0].longitude = res.longitude
								that.coordsToLocationName({
									latitude: res.latitude,
									longitude: res.longitude
								})
								that.isLocation = true
								that.authLocation()
							},
							fail:function (){
								that.authLocation()
							}
						});
					},
					fail(e) {
						console.log(e)
						let that = this;
						if (e.errMsg == "authorize:fail auth deny") { 
							uni.showModal({
								title: '提醒',
								content:'为了更好的享受我们的服务，请授权你的地理位置', 
								success() {
									uni.openSetting({
										success(res) {
											console.log(res)
										}
									})
								}
							})
						}
					}
				})
			},
			// 用户信息
			getUserInfo(){
				user().then(res=>{
					if(res.data.code == 0) {
						this.tel = res.data.result.user_info.mobile
					}
				})
			},
			// 获取预约车辆/门店信息
			getYyIndexMsg() {
				shopDetail({
					data: {
						id: this.sss_id
					}
				}).then((res) => { 
					if (res.data.code == 0) {
						res.data.result.distance = res.data.result.distance > 0 ?(res.data.result.distance / 1000).toFixed(2) :''
						this.checkStoreMsg = res.data.result;
					}
				})
			},
			// 选择预约店铺
			yuyueStore() {
				if (this.storeList.length != 0) {
					this.storeFlag = true;
					return;
				}
				this.storeFlag = true;
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
								list[i].stores[j].distance = list[i].stores[j].distance > 0 ? (list[i].stores[j].distance / 1000).toFixed(2) :''
							}
						} 
						this.storeList = list;
					}
				})
			},
			// 选择店铺
			checkStore(storeMsg) { 
				this.storeFlag = false;
				if (storeMsg != 'close') {
					this.checkStoreMsg = storeMsg;
					this.sss_id = storeMsg.id;
				}
			},
			mapChange(){}, //不能删除
			// 移动地图
			mapChangeEnd(e) {
				var that = this; 
				
				
				this.mapCtx.getCenterLocation({
					success(res) { 
						let data = {
							latitude: res.latitude,
							longitude: res.longitude
						}
						
						that.markers = [{
							id: 0,
							latitude: res.latitude,
							longitude: res.longitude
						}] 
						if(!that.isLocation) {return}
						// 获取的经纬度转换成地理位置名称
						that.coordsToLocationName(data)
					}
				})
			}, 
			// 经纬度换算具体位置
			coordsToLocationName(data){
				getLocationName(data).then((res) => { 
					if(res.status!=0) {
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
					this.locationName = res.result.address;
				})
			},
			// 重置地图位置
			moveToLocation() {
				this.mapCtx.moveToLocation();
			},
			// 是否需要拖车
			trailerPickerChange: function(e) {
				this.railerIndex = e.detail.value; 
			},
			// 保险公司
			CompChange: function(e) {
				this.compIndex = e.detail.value; 
			},
			notLogin(){
				var that = this;
				uni.showModal({ 
					title:'登录提醒',
					content:'您还没有登录，请先登录',
					confirmColor:"#B49A83",
					success(r) {
						if(r.confirm) {
							uni.navigateTo({
								url:'/pages/login/login'
							})
						}
					}
				})
			},
			// 发起定位并呼叫
			toCall() {
				if(uni.getStorageSync('isMobile') != 1){
					this.notLogin()
					return;
				}
				if(!/^1[3456789]\d{9}$/.test(this.tel)){
					uni.showToast({
						title:'请输入正确的手机号',
						icon:'none'
					})
					return
				}
				let coords = gcj02tobd09(this.markers[0].longitude,this.markers[0].latitude)
				let map_latitude = coords[1];
				let map_longitude = coords[0];
				
				let address = this.locationName;
				let store_id = this.checkStoreMsg.id;
				let is_trailer = this.railerIndex;
				let insurer = Number(this.compIndex) + 1;

				uni.showLoading({
					title:'提交中...',
					mask:true
				}) 
				callRescue({
					data: {
						map_latitude: map_latitude + "", // 地图上的标记纬度
						map_longitude: map_longitude + "", // 地图上的标记经度
						address: address, // 详细地址
						store_id: store_id, // 救援门店id
						user_phone: this.tel, // 用户手机号
						is_trailer: is_trailer + "", // 是否需要拖车，0：不需要，1：需要
						insurer: insurer +"" // 保险（1：人保、2：平安、3：太平洋、4：人寿、5：大地、6：中华联合、7：阳光、8：其他）
					}
				}).then((res) => {
					uni.hideLoading() 
					if (res.data.code == 0) {
						let that = this
						uni.showModal({
							title:'拨打电话',
							content:this.checkStoreMsg.rescue_phone,
							showCancel:true,
							cancelText:'取消',
							confirmText:"呼叫",
							confirmColor:"#C9AD94",
							success(r) {
								if(r.confirm) {
									uni.makePhoneCall({
										phoneNumber: that.checkStoreMsg.rescue_phone //仅为示例
									});
								}
							}
						})
						
					}
				})

			},
			toStoreList() {
				uni.navigateTo({
					url: '../storeList/storeList'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import './roadside.scss'
</style>
