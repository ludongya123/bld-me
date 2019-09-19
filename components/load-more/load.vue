<template>
	<view v-show="show">
		<view class="flex-center">
			<image class="icon" src="/static/load.png" mode=""></image>
			<text>加载中...</text>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			show:{
				type:Boolean,
				default:true
			}
		},
		data(){
			return {
				
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss">
	.flex-center{
		font-size: 24upx;
		color:#888;
		padding: 40upx 0;
		.icon{
			width:30upx;
			height: 30upx;
			margin-right: 16upx;
			animation: ani 1s linear infinite;
		}
	}
	@keyframes ani{
		0%{
			transform: rotate(0);
		}
		100%{
			transform: rotate(360deg);
		}
	}
</style>
