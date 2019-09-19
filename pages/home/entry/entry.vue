<template>
	<view>
		
	</view>
</template>

<script>
	//
	import {mapMutations} from "vuex"
	export default {
		data() {
			return {
				
			}
		},
		onLoad(options) {
			uni.showLoading({
				title:'加载中',
				mask:true
			})
			console.log(options)
			if(options.sss_id) {
				this.setIndexStoreId(options.sss_id)
			}
			uni.switchTab({
				url:'/pages/home/home'
			})
		},
		methods: {
			...mapMutations(['setIndexStoreId']),
		}
	}
</script>

<style>

</style>
