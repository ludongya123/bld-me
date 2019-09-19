<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<view class="s-list":key="index">
				<view class="title flex-between">
					<text class="title-left">{{item.store_name}}</text>
					<text class="state" :class="item.state!=1?'wait':''">{{item.state==1?'已回复':'待回复'}}</text>
				</view>
				<view class="xiline"></view>
				<view class="tag">
					<text>反馈时间：{{item.time}}</text>
					<text>反馈类型：{{item.type==1?'投诉':item.type==2?'吐槽':item.type==3?'意见建议':'其他'}}</text>
				</view>
				<view class="content">
					{{item.content}}
				</view>
				<view class="img-wrapper flex-start">
					<block v-for="(img_item,img_index) in item.images" :key="img_index">
						<image :src="img_item" lazy-load :key="img_index" mode="aspectFill" @click="preView(img_item,index)"></image> 
					</block>
				</view>

				<view class="handel-area flex-end"  v-if="item.state==0">
					<view class="edit flex-start" @click="editSuggest(item.id)">
						<image src="/static/user/edit.png" mode=""></image>
						<text>编辑</text>
					</view>
					<view class="edit flex-start" @click="delSuggest(item.id,index)">
						<image src="/static/user/del.png" mode=""></image>
						<text >删除</text>
					</view>
				</view>
				<view class="reply" v-if="item.state==1">
					<view class="reply-title">
						门店回复:
					</view>
					<view class="reply-content">
						{{item.store_response || ''}}
					</view>
				</view>
			</view>
		</block>
		<load :show="isShowLoading"></load>
		<view class="no-init-data" v-if="list.length==0"> 
			<image src="/static/user/hold.png" mode="aspectFill"></image>
			<view class="no-init-data-text" >暂时没有反馈信息哦~</view>
		</view>
		<view class="nodata" v-show="scrollNodata">没有更多数据了~</view>
	</view>


</template>

<script>
	import {
		mySuggest,
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
			this.getMysuggest()
		},
		onUnload() { 
			this.isReload = true
		},
		onShow() { 
		},
		mounted() {
			this.getMysuggest()
		},
		methods: {
			getMysuggest() {
				if (!this.isLoadMore) return
				this.isLoadMore = false
				mySuggest({
					data: {
						page_no: this.page + "",
						page_size: '10'
					}
				}).then(res => {
					if (res.data.code == 0) {
						let list = res.data.result.items
						list = list.map(item=>{ 
							item.images = item.images!='' ? item.images.split(',') : [] 
							return item
						})
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
			editSuggest(id){
				uni.navigateTo({
					url:`/pages/user/submit-suggest/submit-suggest?fid=${id}`
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
	@import "./my-suggest.scss"
</style>
