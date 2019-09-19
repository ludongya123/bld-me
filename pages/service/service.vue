<template>
	<view class="my-service">
		<!-- 客服 -->
		<view class="service-box">
			<image class="service-top" src="/static/service/service1.png" mode="" open-type="contact"></image>
			<button open-type="contact" class="service-btn" @contact="handleContact"></button>
		</view>
		<view class="line"></view>

		<image class="service-ft" src="/static/service/service2.png" mode="" @click="callphone"></image>
		
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
		},
		mounted() {
		},
		methods: {
			callphone(){
				uni.makePhoneCall({
					phoneNumber: "4001818889" 
				});
			},
	　　　　handleContact(e){
		console.log(e)
	}
		}
	}
</script>

<style lang="scss">
@import "./service.scss"
</style>
