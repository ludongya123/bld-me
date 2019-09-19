<template>
	<!-- 111111111111 物流详情 -->
	<view class="logistics-Information">
		<view class="logistics-top">
			<view class="logistics-top-bg"></view>
			<view class="logistics-top-box">
				<view class="logistics-top-cont flex-start-top">
					<image src="/static/user/s-c.png" mode="" class="logistics-top-img"></image>
					<view class="logistics-top-info">
						<text class="paddingbt-32">物流公司：顺丰快递</text>
						<text>物流单号：{{logistics_no}}</text>
					</view>
				</view>
			</view>
			
		</view>
		
		<view class="logistics-ft">
			<view class="logistics-ft-box">
				<view class="logistics-detail " v-for="(item,index) in historyList" :key="index">
					<view class="logistics-detail-content ">
						<text>{{item.time}}</text>
						<text>{{item.content}}</text>
					</view>
					<text class="logistics-detail-sign"></text>
				</view>
				
				
				
				
			</view>
		</view>
	</view>
	
</template>


<script>
	import {logisticsDetail} from "../../../api/user.js"
	export default {
		data() {
			return {
				company:"",
				historyList:[],
				logistics_no:'',
				orderId:''
			}
		},
		onLoad(opts) {
			this.orderId = opts.orderId;
			this.getLogisticsDetail();
		},
		methods: {
			// 获取物流详情
			getLogisticsDetail() {
				uni.showLoading({
					title:"加载中..."
				})
				logisticsDetail({
					env: 'mock'
				}).then((res) => { 
					uni.hideLoading()
					if (res.data.code == 0) {
						
						this.company = res.data.result.company;
						this.historyList = res.data.result.historyList;
						this.logistics_no = res.data.result.logistics_no;
					}
				})

			},
			
		}
	}
</script>

<style lang="scss">
	@import './logistics-Information.scss'
</style>
