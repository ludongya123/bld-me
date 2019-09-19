<!--  -->
<template>
	<view>
		<view class="modal_box" v-if="changeGoodsStatusFlag" @click="checkGoodsStatus('close')"></view>
		<view class="pick_box" :class="{show: changeGoodsStatusFlag}">
		
			<view class="pick_top">
				货物状态
				<image src="../../../static/home/index/icon_delete.png" class="icon_delete" @click="checkGoodsStatus('close')"></image>
			</view>
			<view class="goods-status-cont">
				<view :class="{check_pick_item : currreceiveStateId == item.id}" v-for="(item, index) in yyGoodsStatusList" :key="index">
					{{item.content}}
				</view>
			</view>
			<!-- <view class="pick_content" :class="{'pick_content_height' : yyCarList.length==5}"  scroll-y="true" height="688upx;"  >
		
				<view class="pick_item" :class="{check_pick_item : currreceiveStateId == item.id}" v-for="(item, index) in yyGoodsStatusList" :key="index" @click="checkCar(item, index)">
					<image :src="'https://carbrand.car-me.com/' + item.brand_id + '.png'" class="item_left_img"></image>
					<view class="car_msg">
						<view class="car_msg_title">
							{{item.car_no || '暂无车牌'}}
						</view>
						<view class="car_msg_des">
		
							{{item.series_name}} {{item.vehicle_type_name}}
						</view>

					</view>
					<image src="../../../static/home/baoyang/icon_check_car.png" class="icon_check_car" v-if="currCarId == item.id"></image>
				</view> 
			</view> -->

		</view>
	</view>
	

</template>


<script>
	export default {
		props: ['changeGoodsStatusFlag', 'yyGoodsStatusList','currreceiveStateId'],
		data() {
			return {
				
			}
		}, 
		methods: {
			checkGoodsStatus(carMsg, index) { 
				this.$emit('checkGoodsStatus', carMsg)
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
		height: 900upx;
		background-color: #fff;
		bottom: -900upx;
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
			height: 688upx;
			padding: 37upx 32upx 24upx;
			overflow-y: auto;

			.pick_item {
				position: relative;
				width: 686upx;
				height: 184upx;
				background: #F6F6F6;
				margin: 0 auto 24upx;

				.item_left_img {
					float: left;
					width: 88upx;
					height: 88upx;
					margin: 48upx 24upx 48upx 32upx;
				}

				.car_msg {
					display: flex;
					float: left;
					width: 500upx;
					height: 100%;
					flex-direction: column;
					justify-content: space-around;
					padding: 52upx 0;

					.car_msg_title {
						font-size: 36upx;
						color: #283540;
						font-weight: bold;
					}

					.car_msg_des {
						font-size: 26upx;
						color: #999999;
						font-weight: 400;
					}
				}

				.icon_check_car {
					position: absolute;
					width: 60upx;
					height: 60upx;
					right: 0;
					top: 0;
				}
			}

			.check_pick_item {
				background: linear-gradient(135deg, rgba(180, 198, 205, 1) 0%, rgba(136, 156, 182, 1) 100%);

				.car_msg {

					.car_msg_title,
					.car_msg_des {
						color: #fff;
					}
				}

			}
		}
		.pick_content_height{
			height: 788upx;
		}
		.bottom_btn {
			position: absolute;
			width: 100%;
			height: 100upx;
			background-color: #C9AD94;
			text-align: center;
			line-height: 100upx;
			color: #fff;
			font-size: 32upx;
			font-weight: bold;
			left: 0;
			bottom: 0;
			z-index: 9999;
		}
	}
</style>
