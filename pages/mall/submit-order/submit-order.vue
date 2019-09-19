<template>
	<view class="container">
		<view class="header" v-if="order_type==1">
			<view class="flex-start ps-type">
				<text class="title">配送方式</text>
				<picker mode="selector" :range="deliveryMethod" range-key="delivery_name" :value="deliveryIndex" @change="changeWlType">
					<view> <text>{{deliveryMethod[deliveryIndex].delivery_name}}</text><image src="/static/user/a-l-d.png" mode=""></image> </view>
				</picker>
			</view>
			<view class="xiline"></view>
			<!-- p配送地址 -->
			<view class="address flex-start" v-show="deliveryType==2">
				<view>
					<image class="location-icon" src="/static/location.png" mode=""></image>
				</view> 
				<view class="user-info" v-if="userAddresss.id" @click="openUserAddress()">
					<view class="user-name">
						{{userAddresss.receiver ||''}} <text>{{userAddresss.mobile ||''}}</text>
					</view>
					<view class="user-addr">
						{{userAddresss.detail_address ||''}}
					</view>
				</view>
				<view class="user-info" v-if="addressNum>=1 && !userAddresss.id" @click="openUserAddress()"> 
					请选择收货地址
				</view>
				<view class="user-info" v-if="addressNum==0" @click="openAddAddress()"> 
					请添加收货地址
				</view>
				<view>
					<image class="arrow-icon" src="/static/user/a-l-d.png" mode=""></image>
				</view>
			</view> 
			<!-- 提货地址 -->
			<view class="th-address flex-start" v-show="deliveryType==1">
				<text class="title">提货地址</text>
				<view class="addr-detail">
					<view class="addr-detail-text">
						{{store.store_addr}}
					</view>
					<view class="addr-detail-distance flex-end">
						<image src="/static/home/roadside/icon_location.png" mode=""></image>
						<text> {{store.distance}} </text>
					</view>
				</view>
			</view>
			<view class="xiline" v-show="deliveryType==1"></view>
			<!-- 提货时间 -->
			<view class="th-time flex-start" @click="showChooseTime" v-show="deliveryType==1">
				<text class="title">提货时间</text>
				<view class="flex-right flex-end">
					<text class="active">{{chooseTimeStr || '请选择'}}</text>
					<image src="/static/user/a-l-d.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<!-- 商品信息 -->
		<view class="order-info">
			<view class="title">订单详情</view>
			<view class="order-detail flex-start">
				<view class="pro-img">
					<image :src="product.img" mode="aspectFill"></image>
				</view>
				<view class="pro-name">
					{{product.name}}
				</view>
				<view class="pro-price">
					<view class="dis-price">
						￥{{product.price}}
					</view>
					<view class="orgin-price">
						￥{{product.market_price}}
					</view> 
				</view>
				<view class="flex-start price-area" v-if="order_type==1">
					<image src="/static/mall/jian.png" mode="" @click="handleCount(-1)"></image>
					<text>{{product.quantity}}</text>
					<image src="/static/mall/jia.png" mode="" @click="handleCount(1)"></image>
				</view>
				<view class="count-num" v-if="order_type==2">
					x{{product.quantity}}
				</view>
			</view>
			<!-- 权益详情 -->
			<view class="equity-detail" v-if="order_type==2">
				<view class="title flex-start">
					<image src="/static/mall/qy.png" mode=""></image>
					<text>包含权益</text>
				</view>
				<block v-for="(item,index) in product.rights">
					<view class="item" :key="index"> 
						<text>{{item.desc}}</text>
					</view>
				</block>
			</view>
			<view class="xiline"> </view>
			<view class="total-money-detail">
				<view class="pro-money flex-between">
					<text class="title">商品金额</text>
					<text class="money">￥{{price.product_price}}</text>
				</view>
				<view class="yf-money flex-between" v-if="order_type==1 && deliveryType==2">
					<text class="title">运费</text>
					<text class="money yf">{{price.delivery_price > 0 ? '￥'+price.delivery_price : '免运费'}}</text>
				</view>
			</view>
			<view class="xiline"> </view>
			<view class="total-money">
				合计：<text >￥{{price.pay_price}}</text>
			</view>
		</view>
		<view class="btn-area flex-start">
			<view class="money-o">
				￥{{price.pay_price}}
			</view> 
			<view class="sub-mit" @click="toCreatOrder">
				提交预约
			</view>
		</view>
		<!-- 选择时间弹框 -->
		<ZiTiTime v-on:closeDateModal="closeDateModal" :isShow="isShowChooseTime" :times="times" ></ZiTiTime>
	</view>
</template>

<script> 
import ZiTiTime from "../../../components/ziti-time/ziti-time.vue"
	import {preOrderDetail,createOrder,addressList,payOrder} from "../../../api/mall.js"
	export default {
		data() {
			return {
				goodsId:'',// 商品id
				deliveryIndex:0,
				deliveryType:2, // 发货方式 1 自提 ； 2 快递
				deliveryMethod:[ ],
				userAddresss:{ },// 收货地址
				store:{}, // 门店信息
				product:{}, // 商品信息
				price:{}, // 商品金额
				isShowChooseTime:false,
				times:null, 
				order_type:1, // 订单类型 1 实体商品 2权益商品
				orderToken:'', // 订单的token
				chooseTimeStr:'',// 选择的提货时间点
				addressNum:-1// 收货地址列表数量 
			}
		},
		components:{ 
			ZiTiTime
		},
		onLoad(opts) {
			this.goodsId = opts.id || ''
			this.getDetail()
			uni.hideShareMenu({ })
		}, 
		onShow() {
			console.log(this.userAddresss)
		},
		
		methods: {
			// 获取收货地址列表
			getAddrList(){
				addressList({
					data:{
						page_no:1,
						page_size:100
					}
				}).then(res=>{
					if(res.data.code == 0) {
						this.addressNum = res.data.result.addresses.length
						let defaultAddress = {}
						for(let i in res.data.result.address) {
							if(res.data.result.address[i].is_default == 1) {
								defaultAddress = res.data.result.address[i]
							}
						}
						this.userAddresss = defaultAddress
					}
				})
			},
			// 获取下单前的详情
			getDetail(){
				uni.showLoading({
					title:'加载中...',
					mask:true
				})
				preOrderDetail({
					data:{
						product_id:this.goodsId,
						quantity:this.product.quantity || 1
					}
				}).then(res=>{
					uni.hideLoading()
					if(res.data.code == 0) {
						let {order_token,order_type,delivery_method=[],address,store,product,price,period_list=[] } = res.data.result
						
						this.orderToken = order_token
						this.order_type = order_type 
						this.deliveryMethod = delivery_method 
						this.deliveryType = delivery_method.length != 0 ? delivery_method[this.deliveryIndex].delivery_type : ''
						this.userAddresss = address || {}
						this.store = store || {}
						this.price = price
						this.product = product || {}   
						for(let i in period_list) {
							if(period_list[i].day) {
								period_list[i].dateUse = period_list[i].day.substring(5, 10)
							} 
						}
						this.times = period_list
						if(order_type == 1 && JSON.stringify(address) == "{}") {
							this.getAddrList()
						}
					}
				}).catch(()=>{
					uni.hideLoading()
				})
			},
			// 打开用户的地址列表
			openUserAddress(){
				uni.navigateTo({
					url: `/pages/mall/user-address/user-address?fromPage=submitOrder`
				})
			},
			// 打开添加收货地址界面
			openAddAddress(){
				uni.navigateTo({
					url: `/pages/mall/edit-address/edit-address?fromPage=submitOrder`
				})
			},
			// 选择货运类型
			changeWlType(e){
				console.log(e)
				this.deliveryIndex = e.detail.value
				this.deliveryType = this.deliveryMethod[this.deliveryIndex].delivery_type
			},
			showChooseTime(){
				this.isShowChooseTime = true
			},
			// 关闭时间选择器
			closeDateModal(data=null){
				this.isShowChooseTime = false
				if(data) {
					this.chooseTimeStr = data.chooseDateString + ' ' + data.chooseTimeString
				}
			},
			// 数量加减
			handleCount(c){
				if(this.product.quantity==1 && c==-1) {
					return
				}
				this.product.quantity = parseInt(this.product.quantity) + c
				this.getDetail()
			},
			// 点击提交下单
			toCreatOrder(){ 
				if(this.order_type==1 && this.deliveryType == 2 && !this.userAddresss.id){
					uni.showToast({
						title:'收货地址不能为空',
						icon:'none'
					})
					return
				}
				if(this.order_type==1 && this.deliveryType == 1 && this.chooseTimeStr == ''){
					uni.showToast({
						title:'请选择提货时间段',
						icon:'none'
					})
					return
				}
				uni.showLoading({
					title:'处理中...',
					mask:true
				})
				createOrder({
					data:{
						order_token: this.orderToken,
						order_type: this.order_type,
						delivery_type: this.order_type==2?'':this.deliveryType,
						product_id: this.goodsId,
						quantity: this.product.quantity,  
						address_id: this.userAddresss.id,
						tiem: this.chooseTimeStr
					}
				}).then(res=>{
					uni.hideLoading()
					if (res.data.code == 0) {
						this.payMent(res.data.result.order_no,res.data.result.order_id)
					}
				})
			},
			// 支付
			payMent(orderNo,orderId){
				uni.showLoading({
					title:'正在支付...',
					mask:true
				})
				payOrder({
					data:{
						order_no:orderNo,
						source:'mini',
						ssss_id: uni.getStorageSync('ssssId')
					}
				}).then(res=>{
					uni.hideLoading()
					if(res.data.code == 0) {
						let {timeStamp,nonceStr	,signType,paySign} = res.data.result
						let packAge = res.data.result.package
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: timeStamp,
							nonceStr: nonceStr,
							package: packAge,
							signType: signType,
							paySign: paySign,
							success: function (res) {
								// if(res.)
								uni.navigateTo({
									url:'/pages/user/my-order-detail/my-order-detail?orderId=' + orderId
								})
							},
							fail: function (err) {
								console.log('fail:' + JSON.stringify(err));
							}
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss">
@import './submit-order.scss'
</style>
