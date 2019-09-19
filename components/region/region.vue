<template>
	<view >
		<view class="layer" v-show="show" @click="hideLayer"> </view>
		<view class="layer-content" v-show="show">
			<view class="title flex-between">
				<view class="region-title flex-start">
					<block v-for="(item,index) in region">
						<text @click="navTap(index)" :class="item!='' && currentSwiper==index?'active':''" :key="index">{{item}}</text>
					</block>
				</view>
				<view class="confirm" :class="{active:isConfirm}" @click="confirmRegion">确定</view>
			</view>
			<view class="xiline"></view>
			<swiper class="swiper" :current="currentSwiper" @change="changeSwiper">
				<swiper-item>
					<scroll-view scroll-y class="scroll">
						<block v-for="(item,index) in province.items">
							<view class="item flex-between" :key="index" @click="selectProvince(index,item.code)">
								<text>{{item.name}}</text>
								<image src="/static/mall/Shap.png" mode="" v-show="index==province.index"></image>
							</view> 
						</block>
					</scroll-view>
					
				</swiper-item> 
				<swiper-item v-if="city.items.length!=0">
					<scroll-view scroll-y class="scroll">
						<block v-for="(item,index) in city.items">
							<view class="item flex-between" :key="index" @click="selectCity(index,item.code)">
								<text>{{item.name}}</text>
								<image src="/static/mall/Shap.png" mode="" v-show="index==city.index"></image>
							</view> 
						</block>
					</scroll-view> 
				</swiper-item>
				
				<swiper-item v-if="area.items.length!=0">
					<scroll-view scroll-y class="scroll">
						<block v-for="(item,index) in area.items">
							<view class="item flex-between" :key="index" @click="selectArea(index,item.code)">
								<text>{{item.name}}</text>
								<image src="/static/mall/Shap.png" mode="" v-show="index==area.index"></image>
							</view> 
						</block>
					</scroll-view> 
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import {region } from "../../api/mall.js"
	export default {
		props:['show'],
		data(){
			return {
				province:{
					items:[],
					index:-1
				},
				city:{
					items:[],
					index:-1
				},
				area :{
					items:[],
					index:-1
				}, 
				region:['请选择','',''],
				currentSwiper:0,
				isConfirm:false,
				code:1
			}
		},
		
		watch:{
			show(v){
				if(v) {
					this.province.items = []
					this.city.items = []
					this.area.items = []
					this.province.index= -1
					this.city.index = -1
					this.area.index = -1
					this.region = ['请选择','','']
					this.currentSwiper = 0
					this.isConfirm = false
					this.code = 1
					this.getRegion(0)
				}
			}
		},
		methods:{
			getRegion(tag){
				region({
					data:{
						code:this.code
					}
				}).then(res=>{
					if(res.data.code == 0) {
						if(tag == 0) {
							this.province.items = res.data.result.regions 
							this.province.index = -1
						} else if(tag == 1) {
							this.currentSwiper = 1
							this.region[1] = '请选择'
							this.city.items = res.data.result.regions 
							this.city.index = -1
							if(this.area.items.length!=0) {
								this.area.items = []
							}
						} else {
							this.currentSwiper = 2
							this.region[2] = '请选择'
							this.area.items = res.data.result.regions
							this.area.index = -1
						}
						
					}
				})
			},
			// 选择省份
			selectProvince(index,code){
				if(this.province.index == index) { return }
				this.province.index = index
				this.code = code
				this.region[0] = this.province.items[index].name
				if(this.region[2]!=''){
					this.region[2] = ''
				} 
				this.isConfirm = false
				this.getRegion(1)
			},
			// 选择市
			selectCity(index,code){
				if(this.city.index == index) { return }
				this.city.index = index
				this.code = code
				this.isConfirm = false
				this.region[1] = this.city.items[index].name
				this.getRegion(2)
			},
			// 选择区
			selectArea(index,code){
				if(this.area.index == index) { return }
				this.area.index = index
				this.code = code
				this.region[2] = this.area.items[index].name
				this.isConfirm = true 
			},
			navTap(index){
				if(this.currentSwiper == index) { return } 
				this.currentSwiper = index
			},
			changeSwiper(e){
				this.currentSwiper = e.detail.current
			},
			confirmRegion(){
				if(this.isConfirm) {
					this.$emit('confirm',{region:this.region,code:this.code})
				}
			},
			hideLayer(){
				this.$emit('confirm')
			}
		}
	}
</script>

<style lang="scss">
	.layer{
		position: fixed;
		width:100%;
		height: 100vh;
		background: rgba(0,0,0,0.5);
		z-index:1;
		left:0;
		top:0;
	}
	.layer-content{
		height: 860upx;
		background: #fff;
		position: fixed;
		width:100%;
		bottom:0;
		z-index:2;
		left:0;
		padding: 0 32upx;
		.title{ 
			.confirm{
				color:#666;
				font-size: 26upx;
				padding: 20upx;
				&.active{
					color:#333;
				}
			}
			.region-title{  
				text{ 
					color:#333;
					font-weight: bold; 
					position: relative;
					line-height: 100upx;
					&.active{
						color:#B49A83;  
						border-bottom:4upx solid #B49A83;
					}
					margin-right: 30upx;
				} 
			}
		}
		.swiper{
			height: 756upx;
			.scroll{
				height: 100%;
				padding: 32upx 0;
				.item{
					padding: 24upx 0;
					color:#333;
					&.active{
						color:#B49A83;
					}
					image{
						width:32upx;
						height: 28upx;
					}
				}
			}
		}
	}
</style>
