<template>
	<view class="wrapper">
		<uni-nav-bar @backPage="backPage" :leftIconType="share==1?'home-l':'back-d'" title="会员权益" backgroundColor="#283540" color="#fff"></uni-nav-bar>

		<view class="nav flex-start" :style="{top:statusBarHeight}">
			<view class="nav-item" @click="switchNav(0)" :class="index==0?'active':''">
				<text>余额</text>
			</view>
			<view class="nav-item" @click="switchNav(1)" :class="index==1?'active':''">
				<text>绑定项目</text>
			</view>
			<view class="nav-item" @click="switchNav(2)" :class="index==2?'active':''">
				<text>优惠券</text>
			</view>
		</view>
		<view class="gap"> </view>

		<!-- 余额 -->
		<swiper class="swiper"  @change="changeSwiper" :current="index" :indicator-dots="false" :autoplay="false" :duration="600">
			<swiper-item class="swiper-item">
				<view class="balance" v-if="isMobile==1">
					<view class="pre-balance">
						<view class="flex-between title">
							<view class="content-title">预存余额</view>
							<text class="content-num"> ￥{{balance.prestored.money ? balance.prestored.money/100 :''}} </text>
						</view>
						<view class="xiline"> </view>
						<view class="flex-start desc">
							<image class="icon" src="/static/user/th.png" mode=""></image>
							<text>{{balance.prestored.content || ''}} </text>
						</view>
					</view>
					<view class="give-balance">
						<view class="flex-between title">
							<view class="content-title">赠送余额</view>
							<text class="content-num"> ￥{{balance.present.money ? balance.present.money/100 : ''}} </text>
						</view>
						<view class="xiline"> </view>
						<view class="desc" v-show="balance.present.money>0">
							赠送余额明细
						</view>
						<block v-for="(item,idx) in balance.present.item" :key="idx">
							<view class="give-balance-item" :key="idx" v-show="balance.present.money>0">
								<view class="top">
									<view class="money">
										￥{{item.money/100}}
									</view>
									<view class="date-range">
										有效期: {{item.validity_time}}
									</view>
								</view>
								<view class="flex-between intro">
									<text class="f-l">详细使用说明</text>
									<view class="flex-end" @click="showShade('money',idx)">
										<text class="f-m">点击查看</text>
										<image class="icon" src="/static/user/a-l-y.png" mode=""></image>
									</view>
								</view>
								<text class="tag" v-show="item.is_expired==1">即将过期</text>
							</view>
						</block>
					</view>
				</view>
				<view class="not-mobile" v-else>
					<image src="/static/user/empty.png" mode="aspectFill"></image>
					<view class="dwsc">
						请登录后查看会员权益
					</view>
					<view class="btn" @click="toLogin">
						立即登录
					</view>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<!-- 绑定项目 -->
				<scroll-view scroll-y class="bind-project" @scrolltolower="scrollLower">
					<view class="tip flex-start">
						<image class="icon" src="/static/user/th.png" mode=""></image>
						<text>到店服务时绑定项目可直接抵扣使用</text>
					</view>
					<view class="pro-item" v-for="(item,index) in  product" :key="index">
						<view class="top flex-between" :key="index">
							<view class="f-l">
								<view class="title">
									{{item.name}}
								</view>
								<view class="date-range">
									有效期: {{item.validity_time}}
								</view>
							</view>
							<view class="f-r">
								x <text>{{item.count}}</text>
							</view>
						</view>
						<view class="flex-between intro">
							<text class="f-l">详细使用说明</text>
							<view class="flex-end" @click="showShade('product',index)">
								<text class="f-m">点击查看</text>
								<image class="icon" src="/static/user/a-l-y.png" mode=""></image>
							</view>
						</view>
						<text class="tag" v-show="item.is_expired==1">即将过期</text>
					</view>
					<load :show="showProductLoading "></load>
					<view class="no-init-data" v-if="product.length == 0">没有相关信息</view>
					<view class="nodata" v-show="scrollNodata1">没有更多数据了~</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<!-- 优惠券 -->
				<scroll-view class="ticket" scroll-y @scrolltolower="scrollLower"> 
					<view class="ticket-item" v-for="(item,index) in tickets" :key="index">
						<view class="top flex-between">
							<view class="f-l">
								<view class="title flex-start">
									<text>{{item.coupon_name}}</text>	 <text>x{{item.count}}</text>
								</view>
								<view class="date-range">
									有效期: {{item.validity_time}}
								</view>
							</view>
							<view class="f-r" v-if="item.coupon_type==1">
								￥ <text>{{item.coupon_price/100}}</text>
							</view>
							<view class="f-r" v-if="item.coupon_type==2">
								{{item.discount}} <text>折</text>
							</view>
						</view>
						<view class="flex-between intro">
							<text class="f-l">详细使用说明</text>
							<view class="flex-end" @click="showShade('ticket',index)">
								<text class="f-m">点击查看</text>
								<image class="icon" src="/static/user/a-l-y.png" mode=""></image>
							</view>
						</view>
						<text class="tag" v-if="item.is_expired==1">即将过期</text>
						<text class="cir c-l"></text>
						<text class="cir c-r"></text>
					</view>
					<load :show="showTicketsLoading "></load>
					<view class="no-init-data" v-if="tickets.length == 0">没有相关信息</view>
					<view class="nodata" v-show="scrollNodata2">没有更多数据了~</view>
				</scroll-view>
			</swiper-item>
		</swiper>




		<view class="shade" v-show="isshowShade">
			<view class="shade-container">
				<view class="shade-title">使用说明</view>
				<view class="shade-content">
					<view class="shade-list flex-start" v-show="currData.validity_time"><text>有效期：</text><text>{{currData.validity_time}}</text></view>
					<view class="shade-list flex-start" v-show="currData.use_limit"><text>业务使用：</text><text>{{currData.use_limit}}</text></view>
					<view class="shade-list flex-start" v-show="currData.deduction_limit"><text>扣款限制：</text><text>{{currData.deduction_limit}}</text></view>
					<view class="shade-list flex-start" v-show="currData.store_limit"><text>使用门店：</text><text>{{currData.store_limit}}</text></view>
					<view class="shade-list flex-start" v-show="currData.car_limit"><text>使用车辆：</text><text>{{currData.car_limit}}</text></view>
				</view>
				<view class="xiline"></view>
				<view class="btn" @click="isshowShade=false">
					知道了
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'
	import {
		balance,
		bindProduct,
		tickets
	} from "../../../api/user.js"
	export default {
		data() {
			return {
				statusBarHeight:statusBarHeight,
				index: -1,
				balance: {},
				page1: 1, //绑定项目
				showProductLoading: true,
				isLoadProduct: true, //是否允许滚动加载绑定项目
				scrollNodata1: false,
				product: [],
				isshowShade: false,
				page2: 1, //优惠券
				showTicketsLoading: true,
				isLoadTicket: true,
				scrollNodata2: false,
				tickets: [],
				currData: {},
				share:0, // 是否是分享进来的页面
				isMobile:0 //是否已经手机号登录绑定
			}
		},
		onLoad(opts) {
			this.index = opts.index
			this.share = opts.share || 0 
		}, 
		onShow() { 
			this.$hasToken().then(res=>{
				this.isMobile = uni.getStorageSync('isMobile') || 0
				if(uni.getStorageSync('isMobile') == 1) {
					this.doHandel() 
				}
			})
		},
		onShareAppMessage(res) {
			return {
			  title: '会员权益',
			  path: '/pages/user/user-equity/user-equity?index=0&share=1' 
			}
		},
		methods: { 
			toLogin(){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			},
			// 点击自定义导航的返回跳转
			backPage(){  
				if(this.share == 1) { 
					uni.switchTab({
						url:'/pages/home/home'
					})
				} else {
					uni.navigateBack({
						
					})
				}
			},
			// 监听滚动触底
			scrollLower(){
				
				if (this.index == 1) {
					// 绑定项目触底
					this.getProduct()
				}
				if (this.index == 2) {
					// 优惠券触底
					this.getTicket()
				}
			},
			// 点击navbar
			switchNav(i) {
				if (this.index == i || this.isMobile!=1) return
				this.index = i
				this.doHandel()
			},
			doHandel() {
				if (this.index == 0) {
					this.getBalance()
				}
				if (this.index == 1 && this.page1 == 1) {
					this.getProduct()
				}
				if (this.index == 2 && this.page2 == 1) {
					this.getTicket()
				}
			},
			// 切换swiper
			changeSwiper(e) {
				if (this.index == e.detail.current ) return
				this.index = e.detail.current
				this.doHandel()
			},
			// 获取余额
			getBalance() {
				uni.showLoading({
					title: '加载中...'
				})
				balance().then(res => {
					uni.hideLoading()
					if (res.data.code == 0) {
						this.balance = res.data.result
					}
				})
			},
			// 获取绑定项目
			getProduct() {
				if (!this.isLoadProduct) return
				uni.showLoading({
					title: '加载中...'
				})
				this.isLoadProduct = false
				bindProduct({
					data: {
						page_no: this.page1,
						page_size: 10
					}
				}).then(res => {
					uni.hideLoading()
					if (res.data.code == 0) {
						let list = res.data.result.items
						if (list.length == 10) {
							this.isLoadProduct = true
							this.page1++
						}
						if (list.length < 10) {
							this.showProductLoading = false
						}
						if (list.length < 10 && this.page1 > 1) {
							this.scrollNodata1 = true
						}
						this.product = [...this.product, ...list]
					}
				})
			},
			// 获取优惠券
			getTicket() {
				if (!this.isLoadTicket) return
				uni.showLoading({
					title: '加载中...'
				})
				this.isLoadTicket = false
				tickets({
					data: {
						page_no: this.page2,
						page_size: 10
					}
				}).then(res => {
					uni.hideLoading()
					if (res.data.code == 0) {
						let list = res.data.result.coupons
						if (list.length == 10) {
							this.isLoadTicket = true
							this.page2++
						}
						if (list.length < 10) {
							this.showTicketsLoading = false
						}
						if (list.length < 10 && this.page2 > 1) {
							this.scrollNodata2 = true
						}
						this.tickets = [...this.tickets, ...list]
					}
				})
			},
			// 显示弹出层
			showShade(tag, idx) {
				this.isshowShade = true
				if (tag == 'money') {
					this.currData = this.balance.present.item[idx]
				}
				if (tag == 'product') {
					this.currData = this.product[idx]
				}
				if (tag == 'ticket') {
					this.currData = this.tickets[idx]
				}
			}
		}
	}
</script>

<style lang="scss">
	@import './user-equity.scss'
</style>
