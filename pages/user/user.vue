<template>
	<view class="wrapper">
		<view class="header">
			<image class="bg-img" src="/static/user/user-bg.png" mode=""></image>
			<view class="user-info flex-user-start">
				<view class="user-info-img">
					<open-data type="userAvatarUrl" class="user-heading"></open-data>
				</view>
				<view class="user-info-name flex-user-name" >
					<open-data type="userNickName" class="user-name"></open-data>
					<view class="user-switching-accounts flex-center" v-if="login" @click="switchAccounts()">
						<image class="switch-icon" src="/static/user/qh.png" mode=""></image>切换账号
					</view>
				</view>
				
				<!-- <image class="icon" src="/static/user/a-l-l.png" mode=""></image> -->
			</view>
			<view class="user-account flex-start">
				<view class="account-item" @click="openEquity(0)">
					<view class="account-number"> 
						{{uInfo.user_point/100 || 0}}
					</view>
					<view class="account-title">
						余额（元）
					</view>
				</view>
				<view class="account-item mid" @click="openEquity(1)">
					<view class="account-number"> 
						{{uInfo.user_product || 0}}
					</view>
					<view class="account-title">
						绑定项目
					</view> 
				</view>
				<view class="account-item" @click="openEquity(2)">
					<view class="account-number"> 
						{{uInfo.coupon_count || 0}}
					</view>
					<view class="account-title">
						优惠券
					</view> 
				</view>
			</view>
		</view>
		<view class="my-car">
			<view class="title flex-between" @click="openPage('my-car')">
				<text>我的车辆 {{uInfo.car_num>0 ? `(${uInfo.car_num})`:''}}</text>
				<text class="all">全部</text>
				<image class="icon" src="/static/user/a-l-d.png" mode=""></image>
			</view>
			<view class="xiline"> </view>
			<view class="car-info flex-start" @click="openPage('my-car')" v-show="defaultCarInfo.id">
				<image class="car-icon" :src="carIcon+defaultCarInfo.brand_id+'.png'" mode=""></image>
				<view class="car-info-r">
					<view class="car-name">
						{{defaultCarInfo.car_no}}
					</view>
					<view class="car-detail"> 
						{{defaultCarInfo.series_name}}
						{{defaultCarInfo.vehicle_type_name}}
					</view>
				</view>
			</view>
			<view class="car-handel flex-start" v-show="defaultCarInfo.id">
				<view class="car-handel-item flex-start" @click="openPage('my-car')">
					<image class="icon" src="/static/user/sh.png" mode=""></image>
					<text>售后服务记录</text>
				</view>
				<!-- v-if="defaultCarInfo.is_obd==1" -->
				<view  class="car-handel-item flex-start" v-show="defaultCarInfo.is_obd==1" @click="openPage('car-butler')">
					<image class="icon" src="/static/user/gj.png" mode=""></image>
					<text>爱车管家</text>
				</view>
			</view>
			<!-- 添加车辆 -->
			<view class="add-car" @click="openPage('add-car')" v-show="!defaultCarInfo.id">
				<image src="/static/user/add-car.png" mode=""></image>
				<view class="">点击添加车辆</view>
			</view>
		</view>
		<view class="menu">
			<view @click="clickMenu('appointment-list')"  class="flex-start">
				<image class="icon" src="/static/user/yy.png" mode=""></image>
				<text>我的预约</text>
				<image class="a-icon" src="/static/user/a-l-d.png" mode=""></image>
			</view>
			<view class="xiline"> </view>
			<view @click="clickMenu('my-order-list')"  class="flex-start">
				<image class="icon" src="/static/user/my-order.png" mode=""></image>
				<text>我的订单</text>
				<image class="a-icon" src="/static/user/a-l-d.png" mode=""></image>
			</view>
			<view class="xiline"> </view>
			<view @click="clickMenu('my-suggest')"  class="flex-start">
				<image class="icon" src="/static/user/yj.png" mode=""></image>
				<text>我的意见反馈</text>
				<image class="a-icon" src="/static/user/a-l-d.png" mode=""></image>
			</view>
			<view class="xiline"> </view>
			<view @click="clickMenu('storeList')"  class="flex-start">
				<image class="icon" src="/static/user/md.png" mode=""></image>
				<text>门店列表</text>
				<image class="a-icon" src="/static/user/a-l-d.png" mode=""></image>
			</view>
		</view> 
		<!-- <button type="primary" open-type="contact">客服</button>  -->
	</view>
</template>

	
<script>
	import {user,defaultCar,carIcon,customerList} from "../../api/user.js"
	export default {
		data() {
			return {
				carIcon:carIcon,
				uInfo:{
					user_point:0,
					user_product:0,
					user_coupon:0
				},
				defaultCarInfo:null,
				loadCount:1,
				login:false
			};
		},
		onLoad() { 
			uni.hideShareMenu() 
		},
		onShow() {
			if(uni.getStorageSync('isMobile') != 1){
				this.notLogin()
			} else {
				this.login = true;
				this.getUserInfo()
				this.getDefaultCar()
			}
			
		},
		methods: {
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
						}else if (r.cancel) {
							that.uInfo = {
								user_point:0,
								user_product:0,
								user_coupon:0
							};
							that.defaultCarInfo = null;
							// uni.removeStorageSync('ssssId');
							// that.getUserInfo();
						}
					}
				})
			},
			getUserInfo(){ 
				if(this.loadCount == 1) {
					uni.showLoading({
						title:"加载中..."
					})
				} 
				user().then(res=>{
					if(this.loadCount == 1) {
						uni.hideLoading()
					}
					if(res.data.code == 0){
						this.loadCount = 2
						this.uInfo = res.data.result.user_info
					}
				})
			},
			getDefaultCar(){
				defaultCar().then(res=>{
					if(res.data.code == 0) {
						this.defaultCarInfo = res.data.result.user_car
					}
				})
			},
			openEquity(index) {
				if(uni.getStorageSync('isMobile') != 1){
					this.notLogin()
					return 
				}
				uni.navigateTo({
					url: '/pages/user/user-equity/user-equity?index=' + index
				})
			},
			switchAccounts() {
				if(uni.getStorageSync('isMobile') != 1){
					this.notLogin()
					return 
				}

				uni.showLoading({
					title:"加载中..."
				})
	
				customerList().then(res=>{
					uni.hideLoading()
					if(res.data.code == 0){
						if(res.data.result.customers.length>1){
							uni.navigateTo({
								url: '/pages/user/user-switching-accounts/user-switching-accounts?mobile='+ this.uInfo.mobile+'&id='+'10048'
							})
						}else{
							uni.navigateTo({
								url:'/pages/login/login'
							})
						}
						
					}
				})
				
			},
			openPage(p){
				if(uni.getStorageSync('isMobile') != 1){
					this.notLogin()
					return 
				}
				if(p == "car-butler") {
					this.$isNotionObd().then(()=>{
						uni.navigateTo({
							url:`/pages/user/${p}/${p}?carId=${this.defaultCarInfo.id}`
						})
					}) 
				} else {
					if(p == "my-car" && this.uInfo.car_num==0){
						uni.navigateTo({
							url:`/pages/user/add-car/add-car`
						})
					} else {
						uni.navigateTo({
							url:`/pages/user/${p}/${p}`
						})
					} 
				}
				
			},
			// 打开菜单栏
			clickMenu(tag){
				if(tag != 'storeList'){
					if(uni.getStorageSync('isMobile') != 1){
						this.notLogin()
						return 
					} else {
						uni.navigateTo({
							url:`/pages/user/${tag}/${tag}`
						})
					}
				} else {
					uni.navigateTo({
						url:`/pages/home/${tag}/${tag}`
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.wrapper{
		padding-bottom: 40upx;
	}
	.flex-user-start{
		display: flex;
		justify-content: space-start;
		webkit-box-align:flex-start;
		-webkit-align-items:flex-start;
		-ms-flex-align:flex-start;
		align-items:flex-start;
	}
	.header {
		position: relative;

		.bg-img {
			width: 750upx;
			height: 376upx;
		}

		.user-info {
			position: absolute;
			left: 32upx;
			top: 40upx;
			width: 686upx;

			.user-info-img {
				width: 112upx;
				height: 112upx;
				border-radius: 50%;
				overflow: hidden;
				border: 4upx solid rgba(255, 255, 255, 0.22);
			}

			.user-info-name {
				flex: 1;

				.user-name {
					margin-left: 20upx;
					@include fontStyle(rgba(190, 202, 211, 1), 40upx, 36upx);
					font-weight: bold;
				}
			}
			.flex-user-name{
				display: flex;
				flex-direction:column;
				justify-content: space-start;
				webkit-box-align:flex-start;
				-webkit-align-items:flex-start;
				-ms-flex-align:flex-start;
				align-items:flex-start;
			}
			.icon {
				width: 16upx;
				height: 32upx;
			}
			.switch-icon{
				width: 24upx;
				height: 24upx;
				margin-right: 4upx;
			}
			.user-switching-accounts{
				color: #FFFFFF;
				height:22px;
				background:#535D66;
				border-radius:11px;
				font-size: 22upx;
				width: 160upx;
				text-align: center;
				margin-left: 20upx;
				margin-top: 24upx;
			}
		}

		.user-account {
			position: absolute;
			background: #fff;
			width: 686upx;
			top: 220upx;
			padding: 50upx 0;
			box-shadow: 0px 0px 10px 0px rgba(128, 128, 128, 0.15);
			border-radius: 8upx;
			left: 32upx;

			.account-item {
				flex: 1;
				text-align: center;

				.account-number {
					color: rgba(184, 114, 82, 1);
					font-size: 36upx;
					font-weight: bold;
					margin-bottom: 22upx;
				}

				.account-title {
					color: rgba(136, 136, 136, 1);
					font-size: 24upx;
				}

				&.mid {
					position: relative;

					&:after,
					&:before {
						content: '';
						display: block;
						position: absolute;
						height: 80%;
						border-left: 1upx solid #dedede;
						top: 10%;
					}

					&:before {
						left: 0;
					}

					&:after {
						right: 0;
					}
				}
			}
		}
	}

	.my-car {
		background: #fff;
		margin: 55upx auto 32upx;
		box-shadow: 0px 0px 10px 0px rgba(128, 128, 128, 0.15);
		border-radius: 8upx;
		width: 686upx;
		padding-bottom: 32upx;
		.title {
			padding: 32upx ;
			font-weight: bold;
			font-size: 28upx;
			color:#666;
			.all{
				flex:1;
				font-size: 26upx;
				color:#999;
				text-align: right;
			}
			.icon{
				width:16upx;
				height: 32upx;
				display: block;
				position: relative;
				margin-left: 5upx;
			}
		}

		.car-info {
			padding: 32upx;
			.car-info-r {
				margin-left: 20upx;
			}
			.car-name {
				@include fontStyle (#283540, 36upx, 36upx);
				font-weight: bold;
			}
			.car-detail {
				@include fontStyle (#767F86, 24upx, 24upx);
				margin-top: 16upx;
				line-height: 1.3;
			}
			.car-icon {
				width: 72upx;
				height: 72upx;
			}
		}

		.car-handel {  
			width:622upx;
			margin: 0 auto;
			flex-wrap: wrap;
			padding:24upx 0;
			background: #FCFBFA;
		}

		.car-handel-item {
			width:50%; 
			color: #D9A52C;
			padding-left:30upx; 
			&.bottom{
				margin-top:32upx;
			}
			.icon{
				width: 36upx;
				height: 36upx;
				display: block;
				margin-right: 14upx;
			}
			text {
				@include fontStyle(#B49A83,36upx,26upx);
			}
		}
		.add-car{
			text-align: center;
			padding-top:32upx;
			image{
				width:52upx;
				height: 52upx;
				margin-bottom:24upx;
			}
			color:$base-color;
			font-size: 32upx;
			font-weight: bold;
		}
	}

	.menu {
		background: #fff;
		width: 686upx;
		margin: 0 auto;
		box-shadow: 0px 0px 10px 0px rgba(128, 128, 128, 0.15);
		border-radius: 8upx;
		padding: 0 24upx;
		
		.flex-start {
			padding: 32upx 0;
			.icon{
				width:48upx;
				height: 48upx;
				display: block;
			}
			.a-icon{
				width:16upx;
				height: 32upx;
			}
			text {
				flex: 1;
				margin-left: 20upx;
				color:#333;
			}
		}
	}
</style>
