<template>
	<!-- 111111111111 门店列表 -->

	<view class="pick_box">
		<view class="pick_content">
			<block v-for="(item, index) in storeList" :key="index">
				<view class="pick_item_box" :key="index">
					<view class="title_area">
						{{item.name}}
					</view>
					<view class="store-list">
						<block v-for="(inItem, inIndex) in item.stores">
							<view class="pick_item flex-start" :key="inIndex" @click="changeStore(inItem.id)">
								<view class="store-img">
									<image :src="inItem.image" mode="aspectFill" class="item_left_img" lazy-load></image>
									<view class="brand-icon flex-start">
										<block v-for="(img,img_index) in inItem.logo_ids">
											<image :src="carIcon+img+'.png'" mode="" v-if="img_index<2 && img" :key="img_index"></image>
										</block>
									</view>
								</view>

								<view class="car_msg">
									<view class="car_msg_title">
										{{inItem.name}}
									</view>
									<view class="car_msg_des" >
										<text v-if="inItem.distance">{{inItem.distance>=1?inItem.distance+'km':(inItem.distance*1000)+'m'}}</text>   {{inItem.address}}
									</view>
								</view>
							</view>
							<view class="xiline"></view>
						</block>
					</view>
				</view>
			</block>
			<load :show="showLoading"></load>
			<view class="no_more_data" v-show="scrollNodata">
				没有更多数据了~
			</view>
		</view>
	</view>
</template>


<script>
	import {
		storeList
	} from '../../../api/home/index.js'
	import {
		carIcon
	} from "../../../api/user.js"
	import {
		mapMutations
	} from "vuex"
	import {bd09togcj02,gcj02tobd09}  from "../../../util/util.js"
	export default {
		data() {
			return {
				carIcon: carIcon, 
				storeList: [], // 门店列表数据
				option: {
					page_no: 1, // 当前页数
					page_size: 10 // 一页多少条数据
				},
				scrollNodata: false,
				page_count: 0, // 总页数
				flag: true, // 是否允许加载更多
				showLoading: true,
				openSettingNum:1
			}
		},
		onLoad() {
			
		},
		onReachBottom() {
			if (this.option.page_no < this.page_count) {
				this.option.page_no = this.option.page_no + 1;
				this.getStoreList();
			}
		},
		onShow() {
			let that = this
			uni.getSetting({
				success(res) { 
					if (res.authSetting['scope.userLocation'] === undefined) {
						// 未授权过位置信息  
						that.getStoreList();
						that.getLocationInfo()
					}
					// 拒绝授权120.169813,30.276905
					if (res.authSetting['scope.userLocation'] === false) {  
						that.getStoreList();
						if(that.openSettingNum>1) {return}
						uni.showModal({
							title: '提醒',
							content: '为了更好的享受我们的服务，请授权你的地理位置',
							success(r) {
								if (r.confirm) {
									uni.openSetting({
										success(res) {
											that.openSettingNum++
											console.log(res)
										}
									})
								}
							}
						})
					}
					if (res.authSetting['scope.userLocation'] === true) { 
						that.getLocationInfo()
					}
				}
			})
		},
		methods: {
			...mapMutations(['setIndexStoreId','authLocation']), 
			getLocationInfo(){
				console.log(1)
				let that = this
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						console.log(2)
						uni.getLocation({
							type: 'gcj02',
							success: function(res) { 
								console.log(3)
								let coords = gcj02tobd09(res.longitude,res.latitude) 
								getApp().globalData.longitude = coords[0]; //当前位置的经度
								getApp().globalData.latitude = coords[1]; //当前位置的纬度   
								that.storeList = []; // 门店列表数据
								that.option.page_no = 1;  
								that.scrollNodata = false;
								that.page_count = 0 ;// 总页数
								that.flag = true; // 是否允许加载更多
								that.showLoading = true; 
								that.getStoreList(); 
								that.authLocation()
							},
							fail:function(err){
								that.getStoreList(); 
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
			// 获取门店列表
			getStoreList() {
				if (!this.flag) {
					return;
				}
				this.flag = false;
				storeList({
					data: {
						page_no: this.option.page_no,
						page_size: this.option.page_size
					}
				}).then((res) => {
					if (res.data.code == 0) {
						this.flag = true;
						let list = res.data.result.cities
						for (let i in list) {
							for (let j in list[i].stores) {
								list[i].stores[j].distance = list[i].stores[j].distance > 0 ? (list[i].stores[j].distance / 1000).toFixed(2) : ''
								list[i].stores[j].logo_ids = list[i].stores[j].logo_ids.split(',')
							}
						}
						this.storeList = [...this.storeList, ...list];
						this.page_count = res.data.result.page_count;
						if (this.option.page_no >= this.page_count) {
							this.showLoading = false;
							this.scrollNodata = true
						}
					}
				}) 
			},
			changeStore(storeId) {
				//获取页面栈 
				this.setIndexStoreId(storeId)
				uni.switchTab({
					url: '/pages/home/home'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import './storeList.scss'
</style>
