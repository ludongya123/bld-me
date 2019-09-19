<template>
	<view class="order-detail">
		
		<!-- 订单状态 -->
		<view class="order-detail-top">
			<image src="/static/user/order/state-1.png" mode="" v-if="order.order_state ==1 || order.order_state ==2 ||  order.order_state ==3 "></image>
			<image src="/static/user/order/state-2.png" mode="" v-if="order.order_state ==6"></image>
			<image src="/static/user/order/state-3.png" mode="" v-if="order.order_state ==5"></image>
			<image src="/static/user/order/state-4.png" mode="" v-if="order.order_state ==4 || order.order_state ==7"></image>
			<view class="order-detail-state">{{order.order_state_str}}</view>
			<!-- 待付款倒计时 -->
			<view class="order-detail-top-tip" v-if="order.order_state ==1 ">您的订单已提交，请在<text>{{countDownList}}</text>内完成支付，超时订单自动取消</view>
			
			<!-- 待收货倒计时 -->
			<view class="order-detail-top-tip" v-if="order.order_state ==3">订单<text>{{countDownList}}</text>后自动确认收货</view>
			
			<!-- 退款描述 -->
			<view class="refund-text" v-if="order.order_state ==6 || order.order_state ==7">
				<text v-if="order.order_state ==6 || order.order_state ==7">退款金额：¥500</text>
				<text v-if="order.order_state ==6">(1～3个工作日原路返回)</text>
			</view>
			
		</view>
		
		
		<!-- 配送方式 -->
		<view class="shipping-method " v-if="order.order_type == 1 &&  order.delivery_type == 1 && order.order_state ==1">
			<view class="shipping-method-title">配送方式</view>
			<view class="shipping-method-number" v-if="order.delivery_type">{{order.delivery_type  == 2 ? "快递发货":"到店自提"}}</view>
		</view>
		
		<view class="order-logistic" v-if=" order.order_type == 1 && order.delivery_type == 2">
			<view class="order-logistic-title">物流信息</view>
			<view  class="flex-start order-logistic-box" v-if="order.order_state ==2 " >
				<text class="order-Unshipped">等待平台发货</text>
			</view>
			<view class="flex-start order-logistic-box" v-if=" order.order_state !=5 && order.order_state !=6 && order.order_state !=7 && order.order_state !=1 && order.order_state !=2 " @click="goLogisticsInfo(order.order_id)">
				<image src="/static/user/order/logistic-cart.png" mode="" class="logistic-cart"></image>
				<view class="order-logistic-info flex-start">
					<view class="order-logistic-info-text">
						<text class="order-logistic-info-top">{{deliver.deliver_query_time}}</text>
						<text class="order-logistic-info-ft">{{deliver.delivery_content}}</text>
					</view>
					<image src="/static/user/a-l-d.png" class="logistic-icon" ></image>
				</view>
			</view>
			<view class="xiline" v-if="order.order_state !=0 && order.order_state !=1  && order.order_state !=5 && order.order_state !=6  && order.order_state !=7"></view>
			
			<view class="flex-start order-logistic-box">
				<image src="/static/user/order/logistic-l.png" mode="" class="logistic-cart"></image>
				<view class="order-logistic-info">
					<view class="order-logistic-info-text">
						<view class="order-logistic-info-top"><text class="logistic-name">{{deliver.name}}</text> {{deliver.mobile}}</view>
						<text class="order-logistic-info-ft">{{deliver.address}}</text>
					</view>
				</view>
			</view>
			
		</view>
		
		<!-- 提货码 -->
		<view class="shipping-method " v-if="order.delivery_type == 1 && order.order_state != 1  && order.order_state != 4 && order.order_state != 5 && order.order_state != 6 && order.order_state != 7 && order.order_type == 1">
			<view class="shipping-method-title">提货码</view>
			<view class="shipping-method-number">{{ziTi.goods_code}}</view>
		</view>
		
		<view class="order-delivered"  v-if="order.delivery_type == 1 && order.order_state == 4 && order.order_type == 1">已提货</view>
		
		<!-- 提货信息 -->
		<view class="up-information" v-if="order.delivery_type == 1 && order.order_type != 2 && order.order_state != 0  && order.order_state != 5 && order.order_state != 6 && order.order_state != 7 && order.order_type == 1">
			<view class="up-information-title">提货信息</view>
			<view class="flex-start-order addr-order-text">
				<view class="addr-order  flex-start-order">
					<text class="addr-order-left">提货地址：</text>
					<text class="addr-order-right">{{ziTi.address}}</text>
				</view>
				<view class="navigation flex-start " @click="navigation(ziTi.location,ziTi.address)" ><image src="/static/user/dh.png" class="order-icon" mode=""></image>导航</view>
			</view>
			<view class="addr-order-text"><text class="addr-order-left">提货时间：</text>{{ziTi.time}}</view>
			<view class="addr-order-text"><text class="addr-order-left">提货联系：</text>{{ziTi.contact_name}}<text class="order-tel" @click="callPhone(ziTi.contact_phone)">{{ziTi.contact_phone}}</text></view>
		</view>
		
		<!-- 商品详情 -->
		<view class="order-content">
			<view class="order-content-title">商品详情</view>
			<!-- 实体商品 -->
			<view class="flex-start-order paddingbt-32" >
				<image  :src="benefit_product.img.split(',')[0]" class="order-img" mode="aspectFill"></image>
				<view class="flex-content-order flex-start-order">
					<view class="order-describe">
						<view class="order-title">{{benefit_product.name}}</view>
					</view>
					<view class="order-info">
						<text class="final-price">￥{{benefit_product.price}}</text>
						<text class="total-price" v-if="benefit_product.market_price != '' ">￥{{benefit_product.market_price}}</text>
						<text class="commodity-number">×{{benefit_product.num}}</text>
					</view>
				</view>
			</view>
			<!-- 权益商品 -->
			<!-- <view class="flex-start-order">
				<image :src="order.image" class="order-img" mode="aspectFill"></image>
				<view class="flex-content-order flex-start-order">
					<view class="order-describe">
						<view class="order-title">{{order.name}}</view>
					</view>
					<view class="order-info">
						<text class="final-price">￥{{order.price}}</text>
						<text class="total-price">￥{{order.market_price}}</text>
						<text class="commodity-number">×{{order.quantity}}</text>
					</view>
				</view>
			</view> -->
			
			<!-- 权益商品 权益 -->
			<view class="order-content-info" v-if="order.order_type ==2">
				
				<view class="flex-start info-tip-title" >
					<image src="/static/user/qy.png" class="detail-icon"></image>包含权益
				</view>
				<view class="info-tip flex-start" v-for="(item,index) in benefit_product.rights" :key="index">
					<text class="info-tip-left">{{item.text}}：</text>{{item.desc}}
				</view>
				<!-- <view class="info-tip flex-start">
					<text class="info-tip-left">赠送金额：</text>1000元
				</view>
				<view class="info-tip flex-start-top">
					<text class="info-tip-left">绑定项目：</text>
					<text class="info-tip-flex info-tip-right">CI067-更换刹车油 x1，CI068-A保 x2，原厂轮胎1条 x2</text>
				</view>
				<view class="info-tip flex-start">
					<text class="info-tip-left">优惠券：</text>
					<text>500元美容代金券 x1</text>
				</view> -->
			</view>
			
			
			<view class="xiline"></view>
			<view class="order-detail-amount ">
				<view class="flex-start ">
					<text class="order-detail-amount-text">商品金额</text>
					<text class="detail-amount amount-style">￥{{benefit_product.price}}</text>
				</view>
				
				<view class="flex-start order-detail-amount-ft" v-if="order.order_type == 1 ">
					<text class="order-detail-amount-text">运费</text>
					<text class="detail-amount" v-if="order.delivery_type == 2">{{deliver.price >0? deliver.price:'免运费'}}</text>
					<text class="detail-amount" v-if="order.delivery_type == 1">免运费</text>
				</view>
			</view>
			<view class="xiline"></view>
			<!-- <view class="total-amount " v-if=" order.order_state != 6 && order.delivery_type ==0 " >
				合计:<text>￥{{order.order_price}}</text>
			</view>
			 -->
			<view class="total-amount activeStateAmount" v-if="order.order_state == 1 || order.order_state == 2 || order.order_state == 4" >
				合计:<text>￥{{order.order_price}}</text>
			</view>
			
			<view class="total-amount " v-if="(order.order_state != 2 && order.order_state != 1 && order.order_state != 4 )  && order.delivery_type ==1" >
				合计:<text>￥{{order.order_price}}</text>
			</view>
			<view class="total-amount " v-if="(order.order_state != 2 && order.order_state != 1 &&  order.order_state != 4 )  && order.delivery_type ==2" >
				合计:<text>￥{{order.order_price}}</text>
			</view>
			<view class="total-amount" v-if="(order.order_state == 2 || order.order_state == 4 )&& order.delivery_type ==2">
				实付款:<text>￥{{order.pay_price}}</text>
			</view>
		</view>
		<!-- 订单详情 -->
		
		<view class="order-detail-info">
			<view class="order-detail-info-title">订单详情</view>
			<view class="order-detail-info-tip">订单编号: {{order.order_no}}</view>
			<view class="order-detail-info-tip">下单时间: {{order.order_time}}</view>
			<!-- <view class="order-detail-info-tip" v-if="order.order_state !=1  && order.order_state !=5" >支付方式: {{order.pay_type == 2?"微信支付":"支付宝支付"}}</view> -->
			<view class="order-detail-info-tip" v-if="order.order_state !=1  && order.order_state !=5" >支付方式: 微信支付</view>
			<view class="order-detail-info-tip" v-if="order.order_state !=1  && order.order_state !=5" >支付时间: {{order.pay_time}}</view>
			<button class="order-btn-apply"  type="default" size="mini" v-if="order.order_state ==3 || order.order_state ==4 || order.order_state ==2" @click="applicationRefunda(order.order_id,order.order_type)">申请退款</button>
		</view>
		<!-- 删除订单按钮 -->
		<view class="cancel-order delete-order" @click="deleteOrder(1212)" v-if="order.order_state == 5">删除订单</view>
		<!-- 取消订单 去支付按钮 -->
		<view class="order-detail-footer flex-start" v-if="order.order_state == 1">
			<view class="cancel-order" @click="cancelOrder()">取消订单</view>
			<view class="order-to-pay" @click="toPay(order.order_no)">去支付</view>
		</view>
		
		<view class="order-receipt" v-if="order.order_state == 3">确认收货</view>
		<!-- 浮动客服按钮 -->
		<view @click="kefu">
			<image src="../../../static/user/kefu.png" class="service-img"></image>
		</view>
		<!-- <button  type="default" size="mini" @click="backPage">返回首页</button> -->
	</view>

</template>

<script>
	import {
		myOrderDetail,
		myOrderPay
	} from "../../../api/user.js"
	export default {
		//订单状态
		//0	支付超时（已取消）
		// 1	待支付
		// 2	待评价（支付成功，充值中，预约成功）
		// 3	交易完成（确认完成，充值成功，服务完成）
		// 4	已退款
		// 5	待退款
		// 6	待发货
		// 7	待收货
		
		//更改后
		// 1	待支付
		// 2	待发货（待充值）
		// 3	已发货
		// 4	交易完成
		// 5	交易关闭
		// 6	退款中
		// 7	退款完成
		
		//订单类型
		//1	普通订单
		// 3	充值订单
		// 6	维修预约
		// 9	保养预约
		// 12	普通商品订单
		// 15	权益商品订单
		data() {
			return {
				countDownList: '',
				actEndTime: '2019-08-12 15:01:00',
				intervalTimer:null,
				isLoadMore: true,
				deliverType:'',//配送方式 0:快递发货，1:到店自提
				ziTi:{},//自提信息
				deliver:{},//快递信息
				benefit_product:{},//商品信息
				order:{
					order_type:0,//订单类型 1/12.普通商品订单 15权益商品订单
				},//订单信息
				activeStateAmount:true,
				orderId:''
			}
		},
		onLoad(ops) {
			uni.hideShareMenu();
			this.orderId = ops.orderId
			this.getMyOrderDetail(this.orderId)
		},
		onShow(){
			
		},
		mounted() {
			
			
		},
		
		methods: {
			cancelOrder(){
				uni.showModal({
					// title:'提示',
					content:'确定取消此订单？',
					cancelText:'再想想',
					cancelColor:'#B49A83',
					confirmText:'确定',
					confirmColor:"#999999",
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			toPay(order_no){
				uni.showLoading({
					title:"加载中..."
				})
				const ssssId = uni.getStorageSync('ssssId');
				let that = this;
				myOrderPay({
					data:{
						ssss_id :ssssId,
						order_no: order_no,
						source:'wx'
					}
				}).then((res) => { 
					
					
					if(res.data.code == 0){
						uni.hideLoading();
						console.log(res);
						// 调起支付
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: res.data.result.timeStamp,
							nonceStr: res.data.result.nonceStr,
							package: res.data.result.package,
							signType: 'MD5',
							paySign: res.data.result.paySign,
							success: function(res) {
								that.getMyOrderDetail(that.orderId);
								uni.showToast({
									title:"支付成功",
									icon:"none"
								})
							},
							fail: function(err) {
								
								uni.showToast({
									title:"fail"+ JSON.stringify(err),
									icon:"none"
								})
								console.log('fail:' + JSON.stringify(err));
							}
						});

					}
				})
			},
			getMyOrderDetail(orderId ) {
				console.log(orderId,125)
				uni.showLoading({
					title:"加载中..."
				})
				myOrderDetail({
					data:{
						order_id :orderId
					}
					// env: 'mock'
				}).then(res => {
					if (res.data.code == 0) {
						uni.hideLoading();
						console.log(res.data)
						// this.deliverType = res.data.result.delivery_type;
						this.order = res.data.result.order;
						if (this.order.order_state == 1) {
							this.countDownList='00分00秒';
							this.countDown(this.order.pay_timeout,1,orderId);
						} else if(this.order.order_state == 3){
							this.countDownList='00天00时00分00秒';
							this.countDown(this.deliver.receive_timeout,3,orderId);
						}
						this.benefit_product = res.data.result.benefit_product;
						if(this.order.order_type == 2){
							for (let i in  this.benefit_product.rights) {
								if(this.benefit_product.rights[i].type == 0){
									this.benefit_product.rights[i].text = '预存余额'
								}else if(this.benefit_product.rights[i].type == 1){
									this.benefit_product.rights[i].text = '赠送余额'
								}else if(this.benefit_product.rights[i].type == 2){
									this.benefit_product.rights[i].text = '绑定项目'
								}else if(this.benefit_product.rights[i].type == 3){
									this.benefit_product.rights[i].text = '优惠券'
								}
							}
							
						}
						this.ziTi = res.data.result.zi_ti;
						this.deliver = res.data.result.deliver;
		
					}
				})
			},
			applicationRefunda(orderId,orderType){
				uni.navigateTo({
					url: '/pages/user/application-refunda/application-refunda?orderId='+orderId+'&orderType'+orderType
				})
			},
			navigation(location,name){
				const locationArry = location.split(',')
				const latitude = +locationArry[1];
				const longitude = +locationArry[0];
				const addr = name;

				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					name:addr,
					success: function () {
						console.log('success');
					}
				});
			},
			callPhone(phone){
				// uni.makePhoneCall({
				// 	phoneNumber: phone 
				// });
			},
			goLogisticsInfo(orderId){
				uni.navigateTo({
					url:`/pages/user/logistics-Information/logistics-Information?orderId=${orderId}`
				})
			},
			kefu(){
				uni.switchTab({
					url: '/pages/service/service'
				});
			},
			timeFormat(param) {
				return param < 10 ? '0' + param : param;
			},
			countDown(order_time,orderState,orderId) {
				let order_time_num = parseInt(order_time);
				let endTimeNum = '';
				
				if(orderState == 1){
					endTimeNum =1800;
				}else if(orderState == 3)
				{
					endTimeNum =604800;
				}
				
				if (endTimeNum - order_time_num > 0){
					
					this.intervalTimer = setInterval(() => {
						// 获取当前时间，同时得到活动结束时间数组
						// let newTime = new Date().getTime();
						// 对结束时间进行处理渲染到页面
						// let endTime = new Date(this.actEndTime).getTime();
						let obj = null;
						// 如果活动未结束，对时间进行处理
						if (endTimeNum - order_time_num > 0) {
							endTimeNum--;
							let time = (endTimeNum - order_time_num);
							console.log(time)
							// 获取天、时、分、秒
							let day = parseInt(time / (60 * 60 * 24));
							let hou = parseInt(time % (60 * 60 * 24) / 3600);
							let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
							let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
							obj = {
								day: this.timeFormat(day),
								hou: this.timeFormat(hou),
								min: this.timeFormat(min),
								sec: this.timeFormat(sec)
							};
						} else { // 活动已结束，全部设置为'00'
							obj = {
								day: '00',
								hou: '00',
								min: '00',
								sec: '00'
							};
							clearInterval(this.intervalTimer);
							this.getMyOrderDetail(orderId)
						}
						if(orderState == 1){
							this.countDownList = obj.min + '分' + obj.sec + '秒';
						}else if(orderState == 3){
							this.countDownList = obj.day + '天' + obj.hou + '时' + obj.min + '分' + obj.sec + '秒';
						}
						
					}, 1000);
				}
			},
			//删除订单弹窗
			deleteOrder(orderNo){
				uni.showModal({
					// title:'提示',
					content:'确定删除此订单？',
					cancelText:'在想想',
					cancelColor:'#B49A83',
					confirmText:'确定',
					confirmColor:"#999999",
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
@import "./my-order-detail.scss"
</style>
