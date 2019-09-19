<template>
	<view class="container">
		<block v-for="(item,index) in info">
			<view class="item-g" :key="index">
				<view class="title flex-between">
					<view class="title-left">{{item.title}}</view>
					<view class="title-right"></view>
				</view>
				<block v-for="(item_,index_) in item.items">
					<view class="item-list flex-start" :key="index_">
						<view class="left">{{item_.name}}</view> 
						<view class="right">{{item_.value}}</view>
					</view> 
				</block>
			</view>
		</block>
	</view>
</template>

<script>
	import {carConfig} from "../../../api/mall.js"
	export default {
		data() {
			return {
				carId:'',
				info:[]
			}
		},
		onLoad(opts) {
			this.carId = opts.id ||''
			this.getCarConfig()
		},
		methods: {
			getCarConfig(){
				uni.showLoading({
					title:'加载中...',
					mask:true
				})
				carConfig({
					data:{
						id:this.carId
					} 
				}).then(res=>{
					uni.hideLoading()
					if(res.data.code == 0) {
						this.info = res.data.result.infos
					}
				}).catch(()=>{
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
@import './car-config.scss'
</style>
