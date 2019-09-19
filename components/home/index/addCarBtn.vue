<template>
	<view>
		
		<view class="btn_add_car flex-center empty" :class="inner?'inner':''" v-show="!carMsg.id" @click="opeAddcar()">
			<image class="empty-add-icon" src="/static/user/add-car.png" mode=""></image>
			<text class="empty-add-text">添加车辆自动匹配服务4S店</text>
		</view>
		<!-- 如果有车 -->
		<view class="btn_add_car flex-center" :class="inner?'inner':''" @click="changeCar" v-show="carMsg.id">
			<image :src="carMsg.logo_image" class="icon_car_img" mode="widthFix"></image>
			<view class="car_des">
				<view class="car_des_name flex-start">
					<text class="car_no">{{carMsg.car_no || '暂无车牌'}}</text> 
					<text class="car_name_des" v-if="carMsg.is_obd == 1">
						爱车管家
					</text>
				</view>
				<view class="car_des_det">
					{{carMsg.vehicle_name ||''}}
				</view>
			</view>
			<view class="car_right_icon flex-end">
				<text class="text">切换</text>
				<image class="icon" src="/static/user/a-l-d.png" mode=""></image>
			</view>
		</view>	
		
	</view>
</template>

<script>
	import {carIcon} from "../../../api/user.js"
	export default{
		props:['carMsg','inner'], 
		data() {
			return {
				carIcon:carIcon 
			}
		},
		methods: {
			changeCar() {
				this.$emit('changeCar');
			},
			opeAddcar(){
				if(uni.getStorageSync('isMobile') != 1) {
					uni.navigateTo({
						url:'/pages/login/login'
					})
					return
				}
				uni.navigateTo({
					url:'/pages/user/add-car/add-car'
				})
			}
		}
	}
</script>

<style lang="scss">
	.btn_add_car {
		width: 686upx;
		height: 120upx;
		background-color: #D6BFA9;
		margin: 0 auto 0;
		border-radius: 60upx; 
		position: absolute;
		z-index:10;
		left:32upx;
		top:408upx;
		padding:0 36upx;
		&.inner{
			top:-60upx;
		}
		&.empty{
			background: #DECBB7;
		}
		.empty-add-icon{
			width:48upx;
			height: 48upx;
		}
		.empty-add-text{
			color:$base-color;
			 margin-left:20upx;
		}
	}

	.icon_car_img { 
		width: 64upx;
		height: 64upx; 
	}
	
	.car_des {  
		
		flex:1;
		margin-left: 20upx;
		.car_des_name {
			
			.car_no{
				font-size: 32upx;
				font-weight: bold;
				color:#333;
			}
			.car_name_des {
				width: 108upx; 
				background-color: rgba(51, 51, 51, 1);
				text-align: center;
				line-height: 32upx;
				font-size: 20upx;
				color: #FFFFFF; 
				margin-left: 10upx;
			}
		}
	
		.car_des_det {
			font-size: 24upx;
			margin-top:16upx;
			color:#000;
		}
	}
	
	.car_right_icon {  
		.text{
			font-size: 24upx;
			color: #666666;
		}
		.icon{
			width:16upx;
			height: 32upx;
			margin-left: 10upx;
		}
	}
</style>
