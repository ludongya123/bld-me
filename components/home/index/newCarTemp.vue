<template>
	<view class="new_car_pre">
		<view class="new_car_pre_title flex-between" v-if="newCarData.title_show_type!=3">
			<text class="left">{{newCarData.title}}</text>
			<view class="flex-end" @click="openMore(newCarData.more_link_url,newCarData.title)" v-if="newCarData.title_show_type==2">
				<text>更多</text>
				<image class="arrow-icon" src="/static/user/a-l-d.png" mode=""></image>
			</view>
		</view>
		<view class="new_car_pre_con">
			<scroll-view scroll-x="true" class='new_car_pre_con_scroll' scroll-with-animation="true">
				<image @click="jumpPage(inItem.route_param)" :src="inItem.pic_url" mode="aspectFill" lazy-load class="scroll_item" v-for="(inItem, inIndex) in newCarData.items" :key="inIndex"></image>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {goPage} from "../../../util/util.js"
	export default {
		props: ['newCarData','sid'],
		data() {
			return {}
		},
		methods:{
			openMore(src,title){
				uni.navigateTo({
					url:`/pages/home/web-view/web-view?url=${src}&title=${title}`
				})
			},
			jumpPage(json){ 
				if(json.flag == '4S') {
					this.$emit('reload',{sid:json.extra.ssss_id})
				} else if (json.flag == 'cs') { //在线客服
					
				} else {
					goPage(Object.assign(json, {
						sss_id: this.sid // 首页的门店id
					}), 'home')
				} 
			}
		}
	}
</script>

<style lang="scss">
	.new_car_pre{
		width: 100%;
		overflow-x: hidden
	}
	.new_car_pre_title { 
		padding : 20upx 32upx 24upx;
		.left{
			font-size: 36upx;
			font-weight: bold;
		}
		.flex-end{
			font-size: 24upx;
			color:#888;
			.arrow-icon{
				width:16upx;
				height: 32upx;
			}
		}
		
	}

	.new_car_pre_con {
		width: 728upx;
		height: 208upx;
		background: #fff;
		margin-left: 32upx;
		overflow: hidden;

		.new_car_pre_con_scroll {

			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: row;
			box-sizing: border-box;
			white-space: nowrap;

			.scroll_item {
				display: inline-block;
				width: 392upx;
				height: 208upx;
				margin-right: 16upx;
				border-radius: 6upx;
			}
		}
	}

	// }
</style>
