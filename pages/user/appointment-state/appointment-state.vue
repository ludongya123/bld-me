<template>
	<view>
		<view class="header-state">
			<image src="/static/user/s-a.png" mode="" v-if="objInfo.reserve_state == 2"></image>
			<image src="/static/user/s-b.png" mode="" v-if="objInfo.reserve_state == 3"></image>
			<image src="/static/user/s-c.png" mode="" v-if="objInfo.reserve_state == 4"></image>
			<view class="s-text">{{objInfo.reserve_state_str}}</view>
			<button type="default" size="mini" @click="openTel()" v-if="objInfo.service_number">联系客服</button>
		</view>
		<view class="menu-list">
			<view class="flex-between">
				<view class="left">
					<image class="icon" src="/static/user/time.png" mode=""></image>
					<text class="title">预约时间</text>
				</view>
				<text class="right">{{objInfo.reserve_date}}</text>
			</view>
			<view class="xiline"></view>
			<view class="flex-between" v-if="objInfo.reserve_state != 4">
				<view class="left">
					<image class="icon" src="/static/user/Path1.png" mode=""></image>
					<text class="title">保养项目</text>
				</view>
				<text class="right" v-if="objInfo.reserve_state == 2">以到店后服务内容为准</text>
				<view class="flex-end" @click="openPage('sell-detail',objInfo.workorder_id)" v-if="objInfo.reserve_state == 3 &&  objInfo.workorder_id">
					<text>查看服务工单详情</text>
					<image src="/static/user/a-l-y.png" mode=""></image>
				</view>
			</view>
			<view class="xiline"></view>
			<view class="flex-between">
				<view class="left">
					<image class="icon" src="/static/user/Path.png" mode=""></image>
					<text class="title">保养车辆</text>
				</view>
				<text class="right">{{objInfo.car_info}}</text>
			</view>
			<view class="xiline"></view>
			<view class="flex-between">
				<view class="left">
					<image class="icon" src="/static/user/shop.png" mode=""></image>
					<text class="title">预约4s店</text>
				</view>
				<text class="right">{{objInfo.store_name}}</text>
			</view>
		</view>
		<view class="order-no">
			<view>订单编号：{{objInfo.workorder_id || ''}}</view>
			<view>下单时间：{{objInfo.created_at}}</view>
		</view>
	</view>
</template>

<script>
	import {
		appointDetail
	} from "../../../api/user.js"
	export default {
		data() {
			return {
				id: '', // 工单id或售后单id
				objInfo: {}
			}
		},
		onLoad(opts) {
			uni.hideShareMenu() 
			
			this.id = opts.id
			this.getAppointDetail() 
		},
		methods: {
			// 获取预约详情
			getAppointDetail() {
				uni.showLoading()
				appointDetail({
					data: {
						id: this.id
					} 
				}).then(res => {
					uni.hideLoading()
					if (res.data.code == 0) {
						this.objInfo = res.data.result
					}
				})
			},
			// 跳转到服务类目详情
			openPage(p,id){
				uni.navigateTo({
					url:`/pages/user/${p}/${p}/?id=${id}`
				})
			},
			// 打电话
			openTel(){
				uni.makePhoneCall({
					phoneNumber: this.objInfo.service_number //仅为示例
				});
			}
		}
	}
</script>

<style lang="scss">
	@import './appointment-state.scss'
</style>
