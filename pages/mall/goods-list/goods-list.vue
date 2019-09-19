<template>
	<view>
		<uni-nav-bar @backPage="backPage" :leftIconType="share==1?'home-l':'back-d'" title="全部商品" backgroundColor="#283540" color="#fff"></uni-nav-bar>
		<scroll-view v-if="goodList.length>1" class="nav" scroll-x scroll-with-animation :scroll-into-view="navIntoView">
			<block v-for="(item,index) in goodList">
				<view class="nav-item" :class="currentIndex==index?'active':''" :key="index" :id="'nav'+index" @click="clickNav($event,index)">{{item.category_name}}</view>
			</block>
		</scroll-view>
		<swiper class="swiper" v-if="goodList.length!=0" :class="{height1:goodList.length==1}" @change="slideSwiper" :indicator-dots="false" :current="currentIndex">
			<swiper-item class="swiper-item" v-for="(item,index) in goodList" :key="index" >
				<scroll-view scroll-y @scrolltolower="loadMoreGoods()">
					<view class="banner-wrapper" :class="item.main_imgs.length==0?'empty':''">
						<swiper v-if="item.main_imgs.length!=0" :data-len="item.main_imgs.length" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
							<swiper-item v-for="(_item,_index) in item.main_imgs" :key="_index">
								<image class="banner" :src="_item" mode="aspectFill"></image>
							</swiper-item>
						</swiper>
					</view>

					<goods-temp :goods="item.goods" :tempType="item.configuration" @detail="openDetail"></goods-temp>
					<load :show="item.showLoading"></load>
					<view class="scroll-nodata" v-if="item.scrollNodata">没有更多商品信息了~</view>

					<view class="init-nodata" v-if="item.goods.length==0 || goodList.length==0 " :data-len="item.goods.length">暂时没有相关商品信息</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<view class="init-nodata" v-else>暂时没有相关商品信息</view>
	</view>
</template>

<script>
	import goodsTemp from '../../../components/goods-temp/goods-temp.vue'
	import {
		category,
		goodsList
	} from '../../../api/mall.js'
	export default {
		data() {
			return {
				ssssId:'', // 4s店id
				share:0,// 是否是分享进来的
				currentIndex: 0,
				categoryId:'', // 类目id
				navIntoView: 'nav0',
				goodList: []
			}
		},
		components: {
			'goods-temp': goodsTemp
		},
		onLoad(options) {
			this.share = options.share || 0 
			this.categoryId = options.categoryId || ''
			this.ssssId = options.ssssId || ''
			this.$hasToken().then(res=>{
				this.getCategory()
			})
		},
		onShow() {
			
		},
		onShareAppMessage() {
			return {
			  title: '全部商品',
			  path: `/pages/mall/goods-list/goods-list?share=1&categoryId=${this.categoryId}`
			}
		},
		methods: {
			backPage(){
				if(this.share == 1) { 
					uni.switchTab({
						url:'/pages/home/home'
					})
				} else {
					uni.navigateBack({
						
					})
				}
			},
			clickNav(e, index) {
				this.currentIndex = index
				if (this.goodList[index].goods.length == 0) {
					this.getGoodsList()
				}
				this.navIntoView = index > 0 ? 'nav' + (index - 1) : 'nav0' 
			},
			// 获取类目
			getCategory() {
				uni.showLoading({
					title:'加载中...',
					mask:true
				})
				category({
					data:{
						ssss_id:this.ssssId
					}
				}).then(res => {
					uni.hideLoading()
					if (res.data.code == 0) {
						let list = res.data.result.categories 
						for (let i in list) {
							list[i].page = 1;
							list[i].goods = [];
							list[i].showLoading = true;
							list[i].isCanLoad = true; // 防多次触发加载
							list[i].scrollNodata = false;
							list[i].banner = '';
							list[i].configuration = 1;
						}
						this.goodList = list
						let currentIndex = 0;
						for(let i in list) {
							if(list[i].category_id == this.categoryId) {
								currentIndex = i
							}
						}
						this.currentIndex = currentIndex
						this.navIntoView = 'nav'+currentIndex 
						if(list.length>0){
							this.getGoodsList()
						} 
					}
				}).catch(()=>{
					uni.hideLoading()
				})
			},
			//  获取商品信息
			getGoodsList() {
				
				if (!this.goodList[this.currentIndex].isCanLoad) {
					return
				}
				this.goodList[this.currentIndex].isCanLoad = false
				goodsList({
					data: {
						page_no: this.goodList[this.currentIndex].page,
						page_size: 9,
						category_id: this.goodList[this.currentIndex].category_id
					} 
				}).then(res => {
					if (res.data.code == 0) {
						let {
							products,
							main_imgs,
							configuration
						} = res.data.result
						if (products.length == 9) {
							this.goodList[this.currentIndex].page++
							this.goodList[this.currentIndex].isCanLoad = true
						}
						if (products.length < 9) {
							this.goodList[this.currentIndex].showLoading = false
						}
						if (products.length < 9 && this.goodList[this.currentIndex].page > 1) {
							this.goodList[this.currentIndex].scrollNodata = true
						}
						this.goodList[this.currentIndex].configuration = configuration
						this.goodList[this.currentIndex].main_imgs = !main_imgs ?[]: main_imgs.split(',')
						this.goodList[this.currentIndex].goods = [...this.goodList[this.currentIndex].goods, ...products]
					}
				})
			},
			// 打开商品详情
			openDetail(pid){
				console.log(pid)
				uni.navigateTo({
					url:`/pages/mall/goods-detail/goods-detail?pid=${pid}`
				})
			},
			// 滑动swiper 
			slideSwiper(e) {
				console.log(e)
				let index = e.detail.current
				this.currentIndex = index
				this.navIntoView = index > 0 ? 'nav' + (index - 1) : 'nav0'
				if (this.goodList[index].goods.length == 0) {
					this.getGoodsList()
				}
			},
			// 上拉加载
			loadMoreGoods() {
				this.getGoodsList()
			}
		}
	}
</script>

<style lang="scss">
	@import './goods-list.scss'
</style>
