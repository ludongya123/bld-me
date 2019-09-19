<template>
	<view class="container">
		<view class="banner">
			<swiper class="swiper" v-if="goodsInfo.images.length>1" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
				<swiper-item v-for="(item,index) in goodsInfo.images" :key="index">
					<view class="swiper-item"><image :src="item" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
			<image v-if="goodsInfo.images.length==1" class="banner-img" :src="goodsInfo.images[0]" mode="aspectFill"></image>
		</view>
		<!-- 商品简介 -->
		<view class="goods-intro ">
			<view class="price flex-start">
				<view class="dis-price">
					￥<text>{{goodsInfo.product_price / 100 || 0}}</text>
				</view>
				<view class="orin-price">
					￥{{goodsInfo.market_price / 100 || 0}}
				</view>
			</view>
			<view class="title">
				{{goodsInfo.product_name || ''}}
			</view>
			<view class="sub-title">
				{{goodsInfo.product_desc || ''}}
			</view>
			<view class="xiline" v-if="goodsInfo.product_type==1"></view>
			<view class="yf" v-if="goodsInfo.product_type==1">
				运费：{{goodsInfo.transport_costs > 0 ? '￥'+goodsInfo.transport_costs / 100 : '免运费'}}{{goodsInfo.is_self==1?'/到店自提':''}}
			</view>
		</view>
		<!-- 权益明细 -->
		<view class="equity-detail" v-if="equList.length>0 && goodsInfo.product_type==2">
			<view class="title">
				权益明细
			</view>
			<view class="flex-start equity-g">

				<view class="equity-list" v-for="(item,index) in  equList" :key="index">
					<image :src="'/static/mall/e-'+item.type+'.png'" mode="aspectFill"></image>
					<view class="name" :class="{ticket:item.type==2}">
						{{item.preferential_name}}  <text class="num" v-show="item.num && item.type==1">x{{item.num}}</text>
					</view>
					<view class="desc" v-if="item.type==2">
						{{item.desc}} <text class="num" v-show="item.num && item.type==2">x{{item.num}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 商品详情 -->
		<view class="goods-detail" v-if="goodsInfo.rich_text">
			<view class="title">
				商品详情
			</view>
			<view class="rech-text">
				<rich-text :nodes="goodsInfo.rich_text"></rich-text>
			</view>
		</view>
		<!-- 按钮区域 -->
		<view class="btn-area flex-start">
			<view class="tel">
				<image src="/static/mall/tel-icon.png" mode="aspectFill"></image>
				<view class="text">
					咨询客服
				</view>
			</view>
			<view class="buy" @click="toBuy()"> 
				立即购买 
			</view>
		</view>
	</view>
</template>

<script>
	import {goodsDetail} from "../../../api/mall.js"
	export default {
		data() {
			return {
				productId:'', // 商品id
				goodsInfo:{},
				// 1：绑定项目,2：优惠券，3：预存余额，4：赠送余额
				equList:[ ] // 权益列表
			}
		},
		onLoad(opts) {
			console.log( decodeURIComponent(opts.scene))
			this.productId = opts.pid ||''
			this.getGoodsDetail()
		},
		methods: {
			getGoodsDetail(){
				goodsDetail({
					data:{
						product_id:this.productId 
					}
				}).then(res=>{
					if(res.data.code == 0) {
						let obj = res.data.result
						if(obj.images != '' && obj.images) {
							obj.images = obj.images.split(',')
						}
						this.goodsInfo = obj 
						this.equList = obj.rights
					}
				})
			},
			toBuy(){
				uni.navigateTo({
					url:`/pages/mall/submit-order/submit-order?id=${this.productId}`
				})
			}
		}
	}
</script>

<style lang="scss">
@import './goods-detail.scss'
</style>
