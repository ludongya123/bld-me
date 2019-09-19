<template>
	
	<view>
		
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src:'' ,
				title:''
			}
		},
		onLoad(opts) {
			this.src = opts.url
			this.title = opts.title || 'BLD-me'
			this.$hasToken().then(()=>{
				this.src = decodeURIComponent(opts.url) 
			})
			
			uni.setNavigationBarTitle({
				title:opts.title || 'BLD-me'
			})
		},
		onShareAppMessage() {
			return {
				title: this.title,
				path: `/pages/home/web-view/web-view?url=${encodeURIComponent(this.src)}share=1`
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
