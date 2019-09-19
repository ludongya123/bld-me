<template>
	<view class="pick_box">
		<view class="pick_top">
			安装OBD设备车辆
			<image src="../../../static/home/index/icon_delete.png" class="icon_delete" @click="closeModal"></image>
		</view>
		<view class="pick_content" scroll-y="true" height="688upx;">
			
			<view class="pick_item">
				<image src="../../../static/templateHL.png" class="item_left_img"></image>
				<view class="car_msg">
					<view class="car_msg_title">
						浙D AR098
					</view>
					<view class="car_msg_des">
						奔驰 C级 (进口) 2017 C200L
					</view>
				</view>
			</view>
			
			<view class="pick_item">
				<image src="../../../static/templateHL.png" class="item_left_img"></image>
				<view class="car_msg">
					<view class="car_msg_title">
						浙D AR098
					</view>
					<view class="car_msg_des">
						奔驰 C级 (进口) 2017 C200L
					</view>
				</view>
			</view>
			
			<view class="pick_item">
				<image src="../../../static/templateHL.png" class="item_left_img"></image>
				<view class="car_msg">
					<view class="car_msg_title">
						浙D AR098
					</view>
					<view class="car_msg_des">
						奔驰 C级 (进口) 2017 C200L
					</view>
				</view>
			</view>
			
			
		</view>
	</view>
	
</template>

<script>
	export default {
		methods: {
			closeModal() {
				this.$emit('closeModal');
			}
		}
	}
</script>

<style lang="scss">
	
	.pick_box{
		position: fixed;
		width: 100%;
		height: 800upx;
		background-color: #fff;
		bottom: 0;
		left: 0;
		z-index: 999;
		.pick_top{
			position: relative;
			width: 100%;
			height: 112upx;
			text-align: center;
			line-height: 112upx;
			font-size: 32upx;
			color: #333;
			.icon_delete{
				position: absolute;
				width: 34upx;
				height: 34upx;
				top: 39upx;
				right: 26upx;
			}
		}
		.pick_content{
			height: 688upx;
			padding: 37upx 32upx 24upx;
			overflow-y: auto;
			.pick_item{
				width: 686upx;
				height: 184upx;
				background: #F6F6F6;
				margin: 0 auto 24upx;
				.item_left_img{
					float: left;
					width: 88upx;
					height: 88upx;
					margin: 48upx 24upx 48upx 32upx;
				}
				.car_msg{
					display: flex;
					float: left;
					width: 500upx;
					height: 100%;
					flex-direction: column;
					justify-content: space-around;
					padding: 52upx 0;
					.car_msg_title{
						font-size: 36upx;
						color: #283540;
						font-weight: bold;
					}
					.car_msg_des{
						font-size: 26upx;
						color: #999999;
						font-weight: 400;
					}
				}
			}
		}
	}
</style>
