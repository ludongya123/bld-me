<template>
	<view class="wrapper">
		<view class="desc-info">
			<view class="flex-start"><text> 车 牌 号： </text><text class="content">{{record.records.car_no}}</text></view>
			<view class="flex-start"><text> 品牌车型：</text><text class="content">{{record.records.car_brand}}</text></view>
			<view class="flex-start"><text> 工单编号：</text><text class="content">{{record.records.work_order}}</text></view>
			<view class="flex-start"><text> 服务时间：</text><text class="content">{{record.records.time}}</text></view>
			<view class="flex-start"><text> 服务门店：</text><text class="content">{{record.records.store_name}}</text></view>
			<view class="flex-start"><text> 服务顾问：</text><text class="content">{{record.records.adviser}}</text></view>
		</view>
		<view class="service-detail">
			<view class="title">服务工单明细</view>
			<view class="xiline"></view>
			<block v-for="(item,index) in record.records_detail" :key="index">
				<view class="flex-start">
					<text class="tag" :class="item.name=='配件'?'parts':'man-hour'">{{item.name}}</text>
					<view class="desc_">{{item.detail}}</view>
					<text class="count">{{item.expend}}</text>
				</view>
			</block>
		</view>
		<view class="money-package" v-if="record.coupons.length!=0">
			<view class="title">钱包优惠使用</view>
			<view class="xiline"></view>
			<block v-for="(item,index) in record.coupons">
				<view class="flex-start" :class="item.name=='余额'?'money':''">
					<text class="tag">{{item.name}}</text>
					<view class="desc_">{{item.detail}}</view>
					<text class="count">{{item.count || ''}}</text>
				</view>
			</block>
		</view>
		<view class="btn">
			<button type="default" class="flex-center" open-type="contact">
				<image src="/static/user/kf.png" mode=""></image>
				<text>联系客服</text>
			</button>
		</view>
	</view>
</template>

<script>
	import {
		afterSaleDetail
	} from "../../../api/user.js"
	export default {
		data() {
			return {
				id: '', // 售后id
				record: {}
			}
		},
		onLoad(ops) {
			uni.hideShareMenu()
			this.id = ops.id
			this.getDetail()
		},
		methods: {
			getDetail() {
				uni.showLoading()
				afterSaleDetail({
					data: {
						id: this.id
					}
				}).then(res => {
					uni.hideLoading()
					if (res.data.code == 0) {
						this.record = res.data.result
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "./sell-detail.scss"
</style>
