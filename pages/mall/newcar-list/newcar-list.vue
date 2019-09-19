<template>
	<view class="wrapper">
		<view class="item" v-for="(item,index) in carList" :key="index" @click="openCarDetail(item.id)">
			<image :src="item.image" mode="aspectFill" lazy-load></image>
			<view class="car-info">
				<view class="car-title flex-between" >
					<text class="car-name">{{item.name}}</text>
					<text class="car-price">{{item.price_range}}</text>
				</view>
				<view class="intro" v-show="item.represent">{{item.represent}}</view>
				<view class="car-tags flex-start">
					<block v-for="(item_,index_) in item.tags">
						<text :key="index_">{{item_}}</text> 
					</block> 
				</view>
			</view>
		</view>
		<load :show="isShowloading"></load> 
		<view class="scroll-nodata" v-if="scrollNodata">
			没有更多数据了~
		</view>
		<view class="init-nodata" v-if="carList.length==0">
			暂时没有相关车辆信息~
		</view>
	</view>
</template>

<script>
	import { newCarList } from "../../../api/mall.js"
	// let isCanLoad = true;
	export default {
		data() {
			return {
				storeId:'',// 门店id
				carList:[],
				isShowloading:true,
				scrollNodata:false,
				isCanLoad:true,
				page:1
			}
		},
		onLoad(ops) {
			if(ops.storeId == "undefined"){
				this.storeId = uni.getStorageSync('ssssId')
			}else{
				this.storeId = ops.storeId
			}
			this.getNewCarList()
		},
		onReachBottom() {
			this.getNewCarList()
		},
		methods: {
			getNewCarList(){
				console.log(12333)
				if(!this.isCanLoad) {return}
				this.isCanLoad = false
				newCarList({
					data:{
						store_id:this.storeId,
						page_no:this.page,
						page_size:10
					} 
				}).then(res=>{
					if(res.data.code == 0) {
						let list = res.data.result.cars || []
						for (let i in list) { 
							if(list[i].tags != '') {
								list[i].tags = list[i].tags.split(',')
							} 
						}
						if(list.length == 10) {
							this.page++
							this.isCanLoad = true
						}
						if(list.length < 10) {
							this.isShowloading = false
						}
						if(list.length < 10 && this.page > 1) {
							this.scrollNodata = true
						}
						this.carList = [...this.carList , ...list]
					}
				})
			},
			// 打开车辆详情
			openCarDetail(id){
				uni.navigateTo({
					url:`/pages/mall/newcar-detail/newcar-detail?carId=${id}&ssssId=${this.storeId}`
				})
			}
		}
	}
</script>

<style lang="scss">
@import './newcar-list.scss'
</style>
