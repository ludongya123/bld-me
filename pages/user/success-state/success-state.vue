<template>
	<view>
		<view class="state">
			<image src="/static/user/s-b.png" mode=""></image>
			<view class="s-title">提交成功</view>
			<view class="s-tip">工作人员会尽快与您联系</view>
			<button type="default" size="mini" @click="backPage">返回首页</button> 
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad(ops) {
			uni.hideShareMenu() 
			uni.setNavigationBarTitle({
				title:ops.title
			})
		},
		methods: {
			backPage(){
				uni.switchTab({
					url:'/pages/home/home'
				})
			}
		}
	}
</script>

<style lang="scss">
@import "./success-state.scss"
</style>
