<template>
	<!-- 111111111111 首页的弹框 -->
	<view>
		<view class="modal_box" v-if="storeFlag" @click="checkStore('close')"></view>
		<view class="pick_box" :class="{show: storeFlag}">

			<view class="pick_top">
				选择{{tag}}4S店
				<image src="../../../static/home/index/icon_delete.png" class="icon_delete" @click="checkStore('close')"></image>
			</view>
			<view class="pick_content" scroll-y="true" height="688upx;">

				<view class="pick_item_box" v-for="(item, index) in storeList" :key="index">
					<view class="title_area">
						{{item.name}}
					</view>
					<block v-for="(inItem, inIndex) in item.stores" :key="inIndex">
						<view class="pick_item" @click="checkStore(inItem, index, inIndex)">
							<image :src="inItem.image" mode="aspectFill" class="item_left_img"></image>
							<view class="car_msg">
								<view class="car_msg_title">
									{{inItem.name}}
								</view>
								<view class="car_msg_des" >
									 <text v-if="inItem.distance">{{inItem.distance>=1?inItem.distance+'km':(inItem.distance*1000)+'m'}}</text>  {{inItem.address}}
								</view>
								<!-- <slot is="icon"></slot> -->
							</view>
							<image src="../../../static/home/baoyang/icon_check_store.png" class="icon_check_store" v-if="currentCheck == (index + '-' + inIndex)"></image>
						</view>
						<view class="xiline" v-if="inIndex+1!=item.stores.length"></view>
					</block>
				</view>
			</view>
		</view>
	</view>


</template>


<script>
	export default {
		props: ['storeFlag', 'storeList', 'tag'],
		data() {
			return {
				isCheck: true,
				currentCheck: -1
			}
		},
		methods: {
			closeModal() {
				this.$emit('closeModal');
			},
			checkStore(storeMsg, index, inIndex) {
				if (index != undefined) {
					this.currentCheck = index + '-' + inIndex;
				}
				this.$emit('checkStore', storeMsg)
			}
		}
	}
</script>

<style lang="scss">
	.modal_box {
		position: fixed;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 1);
		opacity: 0.7;
		top: 0;
		z-index: 99;
	}

	.pick_box {
		position: fixed;
		width: 100%;
		height: 800upx;
		background-color: #fff;
		bottom: -800upx;
		left: 0;
		z-index: 999;
		transition: bottom 0.3s ease;

		&.show {
			bottom: 0;
			z-index: 9999;
		}

		.pick_top {
			position: relative;
			width: 100%;
			height: 112upx;
			text-align: center;
			line-height: 112upx;
			font-size: 32upx;
			color: #333;

			.icon_delete {
				position: absolute;
				width: 34upx;
				height: 34upx;
				top: 39upx;
				right: 26upx;
			}
		}

		.pick_content {
			height: 788upx;
			padding: 0 0 24upx;
			overflow-y: auto;

			.pick_item_box {
				margin-bottom: 40upx;
			}

			.title_area {
				font-size: 32upx;
				font-weight: bold;
				color: #333;
				padding: 32upx;
				background: #f0f0f0;
			}

			.pick_item {
				position: relative;
				width: 686upx;
				height: 192upx;
				margin: 0 auto;

				.item_left_img {
					float: left;
					width: 168upx;
					height: 128upx;
					margin: 32upx 16upx 0 0;
				}

				.car_msg {
					display: flex;
					float: left;
					width: 450upx;
					height: 100%;
					flex-direction: column;
					justify-content: space-around;
					padding: 42upx 0;


					.car_msg_title {
						width: 100%;
						font-size: 32upx;
						color: #283540;
						font-weight: bold;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.car_msg_des {
						width: 100%;
						font-size: 26upx;
						color: #999999; 
						text{
							margin-right: 16upx;
							font-size: 26upx;
						} 
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}

				.icon_check_store {
					position: absolute;
					width: 48upx;
					height: 48upx;
					right: 0;
					top: 80upx;
				}
			}

		}
	}
</style>
