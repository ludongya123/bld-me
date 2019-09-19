<template>
	<view >
		<view class="wrapper">
			<block v-for="(item,index) in list" :key="index">
				<view> 
					<view class="list-item flex-start">
						<image src="/static/user/notice-l.png" mode=""></image>
						<text class="tip">{{item.text}}</text>
						<text class="time">{{item.action_date}}</text>
					</view>
					<view class="xiline"></view>
				</view>
			</block>
			<load :show="isShowLoading"></load>
			<view class="nodata" v-show="scrollNodata">没有更多数据了~</view>
		</view>
		<view class="no-init-data" v-if="list.length==0">
			<image src="/static/user/no-data.png" mode=""></image>
			<view>没有任何异常，继续保持哦~</view>
		</view>
	</view>
</template>

<script>
	import {noticeList} from "../../../api/user.js"
	export default{
		data(){
			return {
				id:"",// car id
				list:[],
				isShowLoading:true,
				isLoadMore:true,
				page:1,
				scrollNodata:false
			}
		},
		onLoad(opts) {
			uni.hideShareMenu() 
			this.id = opts.carId
			this.getNoticeList()
		},
		onReachBottom() {
			this.getNoticeList()
		},
		methods:{
			getNoticeList(){
				if(!this.isLoadMore) return 
				this.isLoadMore = false
				noticeList({
					data:{
						car_id:this.id,
						page_no:this.page,
						page_size:20
					}
				}).then(res=>{
					if(res.data.code == 0) {
						let list =  res.data.result.list;
						if(list.length == 20) {
							this.isLoadMore = true;
							this.page++;
						}
						if (list.length < 20) {
							this.isShowLoading = false
						}
						if (list.length < 20 && this.page > 1) {
							this.scrollNodata = true
						}
						this.list = [...this.list,...list]
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "./notice-list.scss"
</style>
