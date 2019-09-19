<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<view class="my-order" :key="index" @click="goMyOrderDetail(item.order_id)">
				<view class="order-top flex-between">
					<text class="order-top-left">下单时间：{{item.pay_time}}</text>
					<text class="order-top-right">{{item.order_state_str}}</text>
				</view>
				<view class="xiline"></view>
				<view class="order-content flex-start-order">
					<image :src="item.image.split(',')[0]" class="order-img" mode="aspectFill"></image>
					<view class="flex-content-order flex-start-order">
						<view class="order-describe">
							<view class="order-title">{{item.name}}</view>
							<!-- <view class="order-specifications">规格1；规格2；规格3；规格4；规格1；规格2；规格3；规格4；</view> -->
						</view>
						<view class="order-info">
							<text class="final-price">{{item.price}}</text>
							<text class="total-price">{{item.market_price}}</text>
							<text class="commodity-number">×{{item.quantity}}</text>
						</view>
					</view>
					
				</view>
				<view class="xiline"></view>
				<view class="order-amounta">应付金额：￥{{item.amounts_price}} <text v-if="item.order_type==1" >（ <text v-if="item.deliver_price>0">含运费</text> {{item.deliver_price>0 ? item.deliver_price:'免运费'}} <text v-if="item.deliver_price>0">元</text>）</text></view>
				<view class="order-payment-amounta" v-if="item.order_state != 1">实付金额：<text>￥{{item.actually_price}}</text></view>
			</view>
		</block>
		<load :show="isShowLoading"></load>
		<view class="no-init-data" v-if="list.length==0"><image src="/static/user/order/no-data.png" mode=""></image>您还没有订单哦~</view>
		
		<view class="nodata" v-show="scrollNodata">没有更多数据了~</view>
	
	</view>


</template>

<script>
	import {
		myOrderPage,
		deleteSuggest
	} from "../../../api/user.js"
	export default {
		data() {
			return {
				page: 1,
				isShowLoading: true,
				scrollNodata: false,
				isLoadMore: true,
				list: [],
				isReload:true
			}
		},
		onLoad() {
			uni.hideShareMenu() 
		},
		onReachBottom() {
			this.getMyOrderPage()
		},
		onUnload() { 
			this.isReload = true
			setTimeout(function(){
				uni.startPullDownRefresh(); 
			},300) 
			
		},
		onPullDownRefresh() {
			setTimeout(function(){
				uni.stopPullDownRefresh();
			},300) 
			this.page = 1;
			this.isLoadMore = true;
			this.list = [];
			this.getMyOrderPage()
		},
		onShow() { 
		},
		mounted() {
			this.getMyOrderPage()
		},
		methods: {
			getMyOrderPage() {
				if (!this.isLoadMore) return
				this.isLoadMore = false
				myOrderPage({
					data: {
						page_no: this.page + "",
						page_size: '10'
					}
				}).then(res => {
					if (res.data.code == 0) {
						let list = res.data.result.items
						// list = list.map(item=>{ 
						// 	item.product.image = item.product.image!='' ? item.product.image.split(',') : [] 
						// 	return item
						// })
						if (list.length == 10) {
							this.isLoadMore = true
							this.page++
						}
						if (list.length < 10) {
							this.isShowLoading = false
						}
						if (list.length < 10 && this.page > 1) {
							this.scrollNodata = true
						}
						this.list = [...this.list, ...list]
					}
				})
			},
			// 编辑跳转
			goMyOrderDetail(orderNo){
				uni.navigateTo({
					url:`/pages/user/my-order-detail/my-order-detail?orderId=${orderNo}`
				})
			},
			// 删除建议
			delSuggest(id,index){
				let that = this;
				
				uni.showModal({
					confirmColor:"#C9AD94",
					title:"删除提醒",
					content:"确定删除此条反馈意见吗？",
					success(r) {
						if(r.confirm) {
							uni.showLoading({
								title:'删除中...',
								mask:true
							})
							deleteSuggest({
								data:{
									feedback_id:id
								}
							}).then(res=>{
								uni.hideLoading()
								if(res.data.code == 0) {
									uni.showToast({
										title:"删除成功",
										icon:"none"
									})
									that.list.splice(index,1)
								}
							})
						}
					}
				}) 
			},
			// 预览
			preView(src,idx){
				let that = this
				uni.previewImage({
					current:src,
					urls:this.list[idx].images,
					success() {
						// that.isReload = false
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "./my-order-list.scss"
</style>
