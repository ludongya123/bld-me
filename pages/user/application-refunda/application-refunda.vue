<template>
	<view class="application-refunda">
		<view class="application-refunda-box">
			<!-- 申请退款 -->
			<view class="application-top flex-start">
				<image class="application-top-img" :src="product.product_image" mode="aspectFill"></image>
				<view class="application-top-text">{{product.product_name}}</view>
			</view>
			
			<!-- 申请退款信息 -->
			<view class="application-info">
				<view class="info-item flex-start" @click="changeGoodsStatus">
					<view class="info-item-left">货物状态</view>
					<view class="info-item-right flex-end">
						<view  class="info-item-right-picker" >请选择</view>
						<image src="/static/user/a-l-l.png" class="icon-right-arrow"></image>
					</view>
				</view>
				
				<view class="xiline"></view>
				<view class="info-item flex-start" >
					<view class="info-item-left">退款原因</view>
					<view class="info-item-right flex-end">
						<picker class="info-item-right-picker" @change="trailerPickerChange" :value="railerIndex" :range="arrayTrailer" >
							请选择
						</picker>
						<image src="/static/user/a-l-l.png" class="icon-right-arrow"></image>
					</view>
				</view>
				<view class="xiline"></view>
				
				<!-- 退款金额 -->
				
				<view class="application-money flex-start">
					<text class="application-money-text">退款金额</text>
					<text class="application-money-amount" v-if="orderType ==2">{{product.refund_amount}}</text>
					<input type="number" v-if="orderType ==1"  :value="product.refund_amount" class="application-money-amount" placeholder="请输入退款金额" placeholder-class="plac_st"
					 @input="changePhone">
				</view>
				<view class="xiline"></view>
				
				<view class="application-note flex-start">
					<view class="application-note-left">退款说明</view>
					<input class="application-note-right" type="text" placeholder="选填"  >
				</view>
				<view class="xiline"></view>
				
				<!-- 添加图片 -->
				<view class="application-img-list">
					<view class="application-img-title"></view>
					<view class="flex-start flex-wrap">
						<view class="img-list-cont " v-for="(item,idx) in img" :key="idx">
							<image class="content" :src="imgHost+item" mode="aspectFill"></image>
							<image class="close-icon" src="/static/user/close.png" mode="" @click="delImg(idx)"></image>
						</view>
						<view class="img-list-cont img-border"v-if="img.length <5" @click="chooseImg">
							<image class="img-camera" src="/static/user/camera.png" mode=""></image>
							<view class="up-text">继续上传(1/5)</view>
						</view>
					</view>
					
				</view>
				
				
				<!-- <view class="info_item">
					<view class="info_item_left">联系手机号</view>
					<input type="number" placeholder="请输入手机号" maxlength="11" v-model="tel">
				</view> -->

				
			</view>
			
			<view class="submit"  @click="submit" >提交</view>
		
		</view>
		<!-- 选择货物状态弹框 -->
		<GStatusView  @checkGoodsStatus="checkGoodsStatus" :changeGoodsStatusFlag="changeGoodsStatusFlag" :currreceiveStateId="receiveStateId"  :yyGoodsStatusList="yyGoodsStatusList"></GStatusView>
		
	</view>

</template>

<script>
	import GStatusView from '../../../components/user/order/GoodsStatusView.vue'
	import {oss,refundinfoDetail,userRefund} from "../../../api/user.js"
	export default {
		components: {
			GStatusView,
		},
		data() {
			return {
				product:{
					product_image:'',
					product_name:''
				},
				receive_state:[],//收货状态	
				refund_amount:'',
				refund_reasons:[],//退款原因数据字典
				imgHost:'',
				img:[],
				yyGoodsStatusList:[],//货物状态列表
				changeGoodsStatusFlag: false, // 选择货物状态
				receiveStateId:'',
				orderId:'',
				orderType:'',//订单类型，1普通商品，2权益商品
			}
		},
		onLoad(ops) {
			uni.hideShareMenu();
			// this.orderId = ops.orderId
			this.orderType = ops.orderType
			this.orderType = 1
			this.orderId = 20
			this.getRefundinfoDetail(this.orderId);
			// console.log(getCurrentPages())
		},
		mounted() {
			
		},
		onHide() {
			this.changeGoodsStatusFlag = false
		},
		methods: {
			changeGoodsStatus(){
				this.changeGoodsStatusFlag = true
				console.log(12)
			},
			getRefundinfoDetail(orderId){
				uni.showLoading({
					title:"加载中..."
				})
				refundinfoDetail({
					data:{
						order_id :orderId,
					}
				}).then((res) => { 
					uni.hideLoading()
					if (res.data.code == 0) {
						this.yyGoodsStatusList = res.data.result.receive_state;
						this.product = res.data.result;
						this.receive_state = res.data.result.receive_state;
						this.refund_reasons = res.data.result.refund_reasons;
						this.refund_amount = res.data.result.refund_amount;
						
					}
				})
			},
			// 申请退款
			submit(){
				console.log(this.img.join(','));
				uni.showLoading({
					title:"加载中..."
				})
				userRefund({
					data:{
						order_id :'',
						receive_state_id: '',
						refund_reason_id:'',
						refund_amount:'',
						refund_explain:'',
						images:this.img.join(',')
					}
				}).then((res) => { 
					uni.hideLoading()
					if (res.data.code == 0) {
						
						
					}
				})
			},
			chooseImg(){
				let that = this
			
				uni.chooseImage({
					count:5 - this.img.length, 
					success(data){ 
						let imgs = data.tempFilePaths
						uni.showLoading({
							title:'上传中...',
							mask:true
						})
						oss({
							data:{
								bussiness_type:'suggestion'
							}
						}).then(res=>{
							uni.hideLoading()
							if(res.data.code == 0) { 
								let ossObj = res.data.result
								that.imgHost = ossObj.host
								for(let i in imgs){
									setTimeout(()=>{
										that.uploadImg(imgs[i],ossObj)
									},20) 
								}
							}
						})
					}
				})
			},
			uploadImg(imgsrc,obj){
		
				const index = imgsrc.lastIndexOf("\.");
				const imgExtension = imgsrc.substring(index + 1, imgsrc.length);
				const imgPath = `${obj.dir}${new Date().getTime()}.${imgExtension}`;
				let that = this;
				uni.showLoading({
					title:"上传中...",
					mask:true
				})
				uni.uploadFile({
					url: obj.host, 
					filePath: imgsrc,
					name: 'file',
					formData: {
						OSSAccessKeyId:obj.access_id, 
						policy:obj.policy,
						signature:obj.signature,
						key:imgPath,
						success_action_status:200 
					}, 
					complete(res) {
						uni.hideLoading()
						if(res.statusCode == 200) {
							 that.img.push('/'+imgPath)
						} 
					}
				});
			},
			delImg(i){
				this.img.splice(i,1)
			},
			// 选择货物状态
			checkGoodsStatus(goodsMsg) {
				console.log(12211)
				this.changeGoodsStatusFlag = false;
				if (goodsMsg != 'close') { 
					thi.receiveStateId = goodsMsg.id;
				}
			}, 
	　　　　
		}
	}
</script>

<style lang="scss">
@import "./application-refunda.scss"
</style>
