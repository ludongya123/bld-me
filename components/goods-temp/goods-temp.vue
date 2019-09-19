<template>
	<view >
		<!-- 小图 -->
		<view class="flex-start temp1" v-if="tempType==1">
			<block v-for="(_item,_index) in goods">
				<view class="temp1-item" :key="_index" @click="openDetail(_item.product_id)"> 
					<image class="img" :src="_item.product_img" mode="aspectFill"></image>
					<view class="goods-info">
						<view class="title"> {{_item.product_name}}</view>
						<view class="price">
							￥ <text>{{_item.product_price / 100}}</text> 
						</view>
					</view>
				</view> 
			</block>
		</view>
		<!-- 大图 -->
		<view class="temp2"  v-if="tempType==2">
			<block v-for="(_item,_index) in goods">
				<view class="temp2-item" :key="_index" @click="openDetail(_item.product_id)">
					<image class="img"  :src="_item.product_img" mode="aspectFill"></image>
					<view class="goods-info">
						<view class="title">  {{_item.product_name}}</view>
						<view class="price">
							￥ <text>{{_item.product_price / 100}}</text> 
						</view>
					</view>
				</view>
			</block>
		</view>
		<!-- 一大两小 -->
		<view class="temp3"  v-if="tempType==3">
			<view class="flex-start">  
				<block v-for="(_item,_index) in goods" >
					<view class="big" v-if="_index%3==0" :key="_index" @click="openDetail(_item.product_id)">
						<image class="img" :src="_item.product_img" mode="aspectFill"></image>
						<view class="goods-info">
							<view class="title"> {{_item.product_name}}</view>
							<view class="price">
								￥ <text>{{_item.product_price / 100}}</text>
							</view>
						</view>
					</view> 
					<view class="small-item" v-else :key="_index" @click="openDetail(_item.product_id)">
						<image class="img" :src="_item.product_img" mode="aspectFill"></image>
						<view class="goods-info">
							<view class="title"> {{_item.product_name}}</view>
							<view class="price">
								￥ <text>{{_item.product_price / 100}}</text>
							</view>
						</view>
					</view>  
				</block>
			</view>
		</view>
		<!-- 详细列表图 -->
		<view class="temp4"  v-if="tempType==4">
			<block v-for="(_item,_index) in goods">
				<view class="temp4-item flex-start" :key="_index" @click="openDetail(_item.product_id)">
					<image class="img" :src="_item.product_img" mode="aspectFill"></image>
					<view class="goods-info">
						<view class="title"> {{_item.product_name}}</view>
						<view class="price">
							￥ <text>{{_item.product_price / 100}}</text>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		props:['goods','tempType'],
		data(){
			return  {}
		},
		watch:{
			goods(v){console.log(v)},
			tempType(v){
				console.log(v)
			}
		},
		methods:{
			openDetail(id){
				console.log(id)
				this.$emit('detail',id)
			}
		}
	}
</script>

<style lang="scss">
	.temp1{
		padding: 0 32upx;
		flex-wrap: wrap;
		.temp1-item{
			width:333upx;
			margin-left: 14upx;
			margin-bottom:14upx;
			
			&:nth-child(2n-1){
				margin-left:0;
			}
			.img{
				width:100%;
				display: block;
				height: 252upx; 
			}
			.goods-info{
				background: #fff;
				padding:16upx 24upx 32upx;
				.title{
					height: 72upx;
					line-height: 36upx;
					@include fontStyle(#333,36upx,26upx);
					@include manyEls(2);
				}
				.price{
					color:#DC606C;
					font-size: 26upx;
					margin-top:16upx;
					font-weight: 600;
					text{
						font-size: 32upx;
						font-weight: bold;
					}
				}
			}
		}
	}
	.temp2{
		padding: 0 32upx;
		.temp2-item{
			background: #fff;
			margin-bottom: 24upx;
			.img{
				width:100%;
				height: 300upx;
				display: block;
			}
			.goods-info{
				padding:24upx 32upx 40upx;
				.title{
					@include singleEls;
					@include fontStyle(#333,40upx,32upx);
					font-weight: bold;
				}
				.price{
					color:#DC606C; 
					margin-top:24upx;
					font-weight: 600;
					text{
						font-size: 44upx;
						font-weight: bold;
					}
				}
			}
			
		}
	}
	.temp3{
		padding: 0 32upx;
		&>.flex-start{
			flex-wrap: wrap;
		}
		.big{
			background: #fff;
			margin-bottom: 24upx;
			width:100%;
			.img{
				width:100%;
				height: 300upx;
				display: block;
			}
			.goods-info{
				padding:24upx 32upx 40upx;
				.title{
					@include singleEls;
					@include fontStyle(#333,40upx,32upx);
					font-weight: bold;
				}
				.price{
					color:#DC606C; 
					margin-top:24upx;
					font-weight: 600;
					text{
						font-size: 44upx;
						font-weight: bold;
					}
				}
			}
		}
 
			.small-item{
				width:333upx;
				margin-left: 14upx;
				margin-bottom:24upx;
				&:nth-child(3n-1){
					margin-left:0;
				}
				.img{
					width:100%;
					display: block;
					height: 252upx; 
				}
				.goods-info{
					padding:16upx 24upx 32upx;
					background: #fff;
					.title{
						height: 72upx;
						line-height: 36upx;
						@include fontStyle(#333,36upx,26upx);
						@include manyEls(2);
					}
					.price{
						color:#DC606C;
						font-size: 26upx;
						margin-top:16upx;
						font-weight: 600;
						text{
							font-size: 32upx;
							font-weight: bold;
						}
					}
				}
			}  
	}
	.temp4{
		padding:0 32upx;
		.temp4-item{ 
			margin-bottom:24upx;
			background: #fff;
			border-radius: 4upx 0 0 4upx;
			overflow: hidden;
			.img{
				width:288upx;
				height: 216upx; 
			}
			.goods-info{
				padding-left:24upx; 
				flex:1;
				.title{
					height: 88upx;
					@include fontStyle(#333,44upx,32upx);
					@include manyEls(2);
				}
				.price{
					color:#DC606C; 
					margin-top:24upx;
					font-weight: 600;
					font-size: 30upx;
					text{
						font-size: 40upx;
						font-weight: bold;
					}
				}
			}
		}
	}
</style>
