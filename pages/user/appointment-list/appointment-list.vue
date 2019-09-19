<template>
	<view>
		<block v-for="(item,index) in plist">
			<view class="list-item" @click="openPage('appointment-state',item.id)" :key="index">
				<view class="title flex-between">
					<text class="t-l">{{item.title}}</text>
					<text class="t-r">{{item.reserve_state==2?'预约成功':item.reserve_state==3?'服务完成':'已取消'}}</text>
				</view>
				<view class="xiline"></view>
				<view class="content">
					<view> 预约时间：{{item.reserve_date}}</view>
					<view> 预约4s店：{{item.store_name}}</view>
					<view> 预约车辆：{{item.car_info || '暂无车牌'}}</view>
				</view>
			</view>
		</block>
		<load :show="isShowLoad"></load>
		<view class="nodata" v-show="isScrollNodata">没有更多数据了~</view>
		<view class="no-init-data" v-if="plist.length==0">
			<image src="/static/user/hold.png" mode="aspectFill"></image>
			<view class="no-init-data-text" >您还没有预约哦~</view>
		</view>
		
	</view>
</template>

<script>
	import {
		appoint
	} from "../../../api/user.js"
	export default {
		data() {
			return {
				isShowLoad: true,
				isMoreLoad: true,
				isScrollNodata: false,
				page: 1,
				plist: []
			}
		},
		onLoad() {
			uni.hideShareMenu() 
			
			this.getAppoint()
		},
		onReachBottom() {
			this.getAppoint()
		},
		methods: {
			getAppoint() {
				if (!this.isMoreLoad) return
				this.isMoreLoad = false
				appoint({
					data: {
						page_no: this.page,
						page_size: 20
					} 
				}).then(res => {
					if (res.data.code == 0) {
						let list = res.data.result.items
						let pageCount = res.data.result.page_count
						let pageNo = res.data.result.page_no
						if (pageNo < pageCount) {
							this.page++
							this.isMoreLoad = true
						}
						if (pageCount == pageNo || pageCount == 0) {
							this.isShowLoad = false
						}
						if (pageNo == pageCount && pageNo > 1) {
							this.isScrollNodata = true
						}
						this.plist = [...this.plist, ...list]
					}
				})
			},
			// 跳转至预约的状态详情
			openPage(p,id){
				uni.navigateTo({
					url:`/pages/user/appointment-state/appointment-state?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "./appointment-list.scss"
</style>
