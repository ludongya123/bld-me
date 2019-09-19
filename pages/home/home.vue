<template>
	<view>
		<!-- 全部门店 -->
		<block v-if="indexData.index_type == 1">
			<!-- banner和添加车辆的按钮 -->
			<view class="index_top"> 
				<view class="banner-wrapper" v-if="indexData.banners.length>1">
					<swiper class="swiper" circular :indicator-dots="swiperData.indicatorDots" @change="changeSwiper" :autoplay="swiperData.autoplay"
					 :interval="swiperData.interval" :duration="swiperData.duration">
						<swiper-item v-for="(item, index) in indexData.banners" :key="index">
							<image :src="item.image" :key="index" class="swiper-item" @click="jumpPage(item.router_param)"></image>
						</swiper-item>
					</swiper>
					<view class="dots flex-center temp1">
						<text :class="currentSwiperIndex==index_?'active':''" v-for="(item, index_) in indexData.banners" :key="index_"></text>
					</view>
				</view>
				<!-- 只有一张图片时 -->
				<image class="banner-img" v-else :src="indexData.banners[0].image" @click="jumpPage(indexData.banners[0].router_param || '')" mode="aspectFill"></image>
				<!-- 添加车辆按钮 -->
				<AddCarBtn :carMsg="indexData.car" @changeCar="changeCar" :inner="false"></AddCarBtn>
			</view>
			<!-- 门店列表 -->
			<view class="index_list" v-for="(item, index) in indexData.storeList" :key="index" @click="toDetailStore(item.id)">
				<image :src="item.image" lazy-load class="item_img img_default" mode="aspectFill"></image>
				<view class="brand_icon flex-start">
					<block v-for="(icon,idx) in item.logo_images" :key="idx">
						<view class="icon" :key="idx" v-if="idx<=2">
							<image :src="icon" mode=""></image>
						</view>
					</block>
				</view>
				<view class="item_des">
					<view class="item_name">
						{{item.name || ''}}
					</view>
					<view class="item_right flex-start">
						<view class="item_address">
							{{item.address || ''}}
						</view>
						<view class="distance" v-if="item.distance">
							<image src="/static/home/location.png" mode=""></image>
							<text>{{item.distance>=1?item.distance+'km':(item.distance*1000)+'m'}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="no-store" v-if="indexData.storeList.length==0">没有门店信息~</view>
		</block>

		<!-- type：2，展示单个门店具体数据 -->
		<block v-else> 
		
		
			<!-- 轮播图 bananer-->
			<view class="banner-wrapper" v-if="indexData.banners.length>1">
				<swiper class="swiper2" circular :autoplay="swiperData.autoplay"
				 :interval="swiperData.interval" :duration="swiperData.duration"  @change="changeSwiper">
					<swiper-item v-for="(item, index) in indexData.banners" :key="index">
						<image :src="item.image" class="swiper-item" mode="aspectFill" @click="jumpPage(item.router_param)"></image>
					</swiper-item>
				</swiper>
				<view class="dots flex-center">
					<text :class="currentSwiperIndex==index?'active':''" v-for="(item, index) in indexData.banners"></text>
				</view>
			</view>
			<image class="banner-img temp2" v-else :src="indexData.banners[0].image" @click="jumpPage(indexData.banners[0].router_param || '')" mode="aspectFill"></image>
			
			
			<!-- 添加按钮 + icon -->
			<view class="index_content"> 
				<!-- 添加车辆按钮 -->
				<AddCarBtn :carMsg="indexData.car" @changeCar="changeCar" :inner="true"></AddCarBtn>
				<!-- icon组件 -->
				<IndexIcon  :iconData='indexData.icons' @toDetailPre="toDetailPre"></IndexIcon>
				<view class="obd-icon">
					<image src="/static/home/bb.png" mode="aspectFill"></image>
					<view class="left" @click="clickObdImg('l')"> </view>
					<view class="right" @click="clickObdImg('r')"> </view>
				</view>
			</view>
			
			
			<!-- 单个门店下边内容 推荐内容 -->
			<view class="img_remind_box" v-if="indexData.index_remind">
				<image :src="indexData.index_remind.image" mode="aspectFill" class="img_index_remind img_default" @click="openWeb(indexData.index_remind.route_param)"></image>
				<image src="../../static/user/close.png" class="icon_delete_btn" @click="deleteRemind" v-if="indexData.index_remind.can_close == 1"></image>
			</view>


			<view class="line_gray"></view>

			<!-- activities活动 -->
			<block v-for="(item, index) in indexData.activities" :key="index">
				<!-- 平铺 -->
				<block v-if="item.template_type == 1">
					<view class="active-colum">
						<view class="active-title flex-between" v-if="item.title_show_type!=3">
							<text class="left">{{item.title}}</text>
							<view class="flex-end" v-if="item.title_show_type==2" @click="openMore(item.more_link_url)">
								<text>更多</text>
								<image src="/static/user/a-l-d.png" mode=""></image>
							</view>
						</view>
						<view class="gongge_box" :key="index">
							<block v-for="(inItem,inIndex) in item.items">
								<button class="img-container" open-type="contact" :key="inIndex" v-if="inItem.route_param.flag=='cs'">
									<image :src="inItem.pic_url" @click="jumpPage(inItem.route_param)" class="img_gongge" mode="aspectFill" lazy-load 
								 ></image>
								 </button>
								 <view class="img-container" :key="inIndex" v-else>
								 	<image :src="inItem.pic_url" @click="jumpPage(inItem.route_param)" class="img_gongge" mode="aspectFill" lazy-load 
								 	></image>
								 </view>
							 </block>
						</view>
					</view>
				</block>
				<!-- 横向滚动 -->
				<block v-if="item.template_type == 2">
					<view class="bottom_content" :key="index">
						<NewCarTemp @reload="reloadPage" :newCarData="item" :sid="sss_id"></NewCarTemp>
					</view>
				</block>
			</block>


			<view class="line_gray"></view>
			
			
			<!-- 精彩推荐 -->
			<view class="recom_box" >
				<view class="recom_title">精彩推荐</view>
				<block v-for="(item, index) in indexData.recommends" >
					<image :key="index" :src="item.image" class="recom_img" @click="openWeb(item.router_param,item.title)"></image>
				</block>
			</view>


			<!-- 选择车辆弹框 -->
			<homePickCarView @closeModal="closeModal" @toObdDetail="toObdDetail" :changeCarFlag="changeCarFlag" :carList="obd.carList"></homePickCarView>


		</block>


	</view>
</template>

<script>
	
	import IndexIcon from '../../components/home/index/icon.vue'
	import NewCarTemp from '../../components/home/index/newCarTemp.vue'
	import homePickCarView from '../../components/home/index/homePickCarView.vue'
	import AddCarBtn from '../../components/home/index/addCarBtn.vue'
	import {
		sign,
		hotCar,
		getIndexData, // 首页数据
		getCarList, // 获取OBD车辆列表
		getDefaultCar, // 获取默认车辆
	} from '../../api/home/index.js'

	import {
		goPage
	} from '../../util/util.js';
	import {
		mapGetters
	} from "vuex"
	export default {
		data() {
			return { 
				sss_id: '', // 门店id  
				indexData: {
					index_type: 0, // 1：集团首页，2：门店首页
					banners: [], // 首页的banner
					storeList: [], // 为全部门店时的店铺列表
					car: null, // 车辆信息
					current_store: {}, // 当前门店
					icons: null,
					index_remind: null, // 重要提醒
					activities: null, // 活动列表
					recommends: null, // 精彩推荐
				},
				obd: {
					carList: [] // OBD的汽车列表
				},
				swiperData: {
					indicatorDots: true,
					autoplay: true,
					interval: 3000,
					duration: 500
				},
				currentSwiperIndex:0,
				// type: 1, // type为1：全部门店列表，2：单个门店详情
				iconData: [1, 2, 3, 4, 5],
				newCarData: {
					title: '新车特惠'
				},
				changeCarFlag: false, // 为true弹出选车弹层
				loadCount:1 // loading显示的次数
			};
		},
		computed: {
			...mapGetters(['getIndexStoreId', 'getIsLocation'])
		},
		components: {
			IndexIcon,
			NewCarTemp,
			homePickCarView,
			AddCarBtn
		},
		onShow() {
			this.sss_id = this.getIndexStoreId != '' ? this.getIndexStoreId : this.sss_id
			this.$hasToken().then(() => { 
				this.getIndexData()
			})
		},
		onLoad(opts) {
			if (!opts.ssss_id) {
				this.$hasToken().then(() => {
					this.getIndexData()
				})
			} else {
				this.sss_id = opts.ssss_id || ''
			}
		},
		onReady() {},
		onPullDownRefresh() { 
			this.getIndexData(1)
			// this.getDefaultCar(1);
		},
		watch: {
			// 监听首页的4s店id的变化
			// sss_id() {
			// 	this.$hasToken().then(() => {
			// 		this.getIndexData()
			// 	})
			// },
			// 监听是否定位用户位置成功
			getIsLocation(v) { 
				if (v) {
					this.$hasToken().then(() => {
						this.getIndexData() 
					})
				}
			}
		},
		methods: {
			changeSwiper(e){
				this.currentSwiperIndex = e.detail.current
			},
			// 获取首页banner数据
			getIndexData(n) { 
				if(this.loadCount == 1) {
					uni.showLoading({
						title:'加载中...',
						mask:true
					})
				} 
				getIndexData({
					data: {
						store_id: this.sss_id,
						car_id:''
					}
				}).then((res) => { 
					if(n == 1) {
						uni.stopPullDownRefresh()
					}
					if(this.loadCount == 1) { 
						uni.hideLoading()
					}
					if (res.data.code == 0) {
						this.loadCount = 2
						this.currentSwiperIndex = 0
						let {
							index_type,
							head_images,
							stores,
							current_store,
							icons,
							index_remind,
							activities,
							car,
							recommends
						} = res.data.result
						this.indexData.index_type = index_type;
						this.indexData.car = car;
						 
						for (let i in head_images){
							if(head_images[i].router_param ) {
								head_images[i].router_param = JSON.parse(head_images[i].router_param)
							} 
						}
						this.indexData.banners = head_images;
						// 如果是全部门店首页（集团首页）
						if (this.indexData.index_type == 1) {
							this.indexData.storeList = stores.map(item => { 
								item.distance = item.distance > 0? (item.distance / 1000).toFixed(2) : ''
								return item
							})
						}
						// 如果是门店首页
						if (this.indexData.index_type == 2) {
							uni.setStorageSync('ssssId',current_store.id)
							this.indexData.current_store = current_store; 
							icons = icons.filter((item) => {
								return item.router_param.indexOf('obd_entrance') < 0
							})
							for (let i in activities) {
								for (let j in activities[i].items) {
									activities[i].items[j].route_param = JSON.parse(activities[i].items[j].route_param)
								}
							} 
							this.indexData.activities = activities;
							this.sss_id = current_store.id;
							this.indexData.icons = icons;
							this.indexData.index_remind = index_remind; 
							this.indexData.recommends = recommends;
						}else{
							uni.removeStorageSync("ssssId")
						}
					} else {
						uni.showToast({
							title:res.data.message,
							icon:'none'
						})
					}
				}).catch((err)=>{ 
					uni.hideLoading()
				}) 
			},
			// 点击obd或者会员权益
			clickObdImg(tag) {
				if (tag == 'l') {
					this.getOBDCarList()
				}
				if (tag == 'r') {
					uni.switchTab({
						url: '/pages/user/user'
					})
				}
			},
			// OBD车辆列表
			getOBDCarList() {
				if (uni.getStorageSync('isMobile') != 1) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				} 
				getCarList({
					data: {
						page_no: 1,
						page_size: 100,
						is_obd: '1' // 1：obd车辆，2：非obd车辆
					}
				}).then((res) => {
					if (res.data.code == 0) {
						this.obd.carList = res.data.result.user_cars;
						if (this.obd.carList.length == 0) {
							uni.navigateTo({
								url: '/pages/home/obd/obd'
							})
						} else if (this.obd.carList.length == 1) {
						
							this.toObdDetail(this.obd.carList[0].id)

						} else {
							this.changeCarFlag = true;
						} 
					}
				})
			},
			// 获取默认车辆
			getDefaultCar() {
				if (uni.getStorageSync('isMobile') != 1) {
					this.getIndexData('')
					return
				}
				getDefaultCar().then((res) => {
					if (res.data.code == 0) {
						this.indexData.car = res.data.result.user_car;
						this.getIndexData(res.data.result.user_car.id)
					}
				})
			},
			toObdDetail(carId) {
				this.$isNotionObd().then(()=>{
					uni.navigateTo({
						url: '../user/car-butler/car-butler?carId=' + carId
					})
				}) 
			},
			deleteRemind() {
				this.indexData.index_remind = null;
			},
			// 单个4s店详情
			toDetailStore(id) {
				this.sss_id = id
				this.getIndexData()
			},
			// 重载4s店详情
			reloadPage(params){ 
				this.sss_id = params.sid
				this.getIndexData()
			},
			changeCar() {
				// 如果没有车辆信息，去添加车辆
				if (!this.indexData.car) {
					uni.navigateTo({
						url: '../user/add-car/add-car'
					})
				}
				// 如果有车辆信息，去编辑车辆
				else if (this.indexData.car) {
					uni.navigateTo({
						url: '../user/my-car/my-car'
					})
				}
			},
			closeModal() {
				this.changeCarFlag = false;
			},
			// icon和banner之类的跳转页面
			toDetailPre(option) {
				if(option.title == '新车'){
					goPage(Object.assign(JSON.parse(option.router_param), {
						sss_id: this.sss_id
					}), 'mall')
				}else{
					goPage(Object.assign(JSON.parse(option.router_param), {
						sss_id: this.sss_id
					}), 'home')
				}
				

			},
			// 点击活动推荐的图片跳转规则
			jumpPage(json = {}){  
				if(json.flag == '4S') {
					this.reloadPage({sid:json.extra.ssss_id})
				} else if (json.flag == 'cs') {
					
				} else {
					goPage(Object.assign(json, {
						sss_id: this.sss_id
					}), 'home')
				}
			},
			// 点击查看更多
			openMore(url){ 
				uni.navigateTo({
					url:'/pages/home/web-view/web-view?url=' + encodeURIComponent(url)
				})
			},
			// 打开外连接 
			openWeb(params,title){
				let obj = JSON.parse(params)
				goPage(obj)
			}
		}
	}
</script>

<style lang="scss">
	@import './home.scss'
</style>
